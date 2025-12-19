/**
 * Patreon Integration Service
 * Secure backend verification of Patreon supporter status
 * 
 * Features:
 * - OAuth 2.0 integration with Patreon
 * - Supporter status verification
 * - Tier-based access control
 * - Webhook synchronization
 * - Token refresh mechanism
 */

class PatreonService {
    constructor(config) {
        this.clientId = config.clientId;
        this.clientSecret = config.clientSecret;
        this.redirectUri = config.redirectUri;
        this.webhookSecret = config.webhookSecret;
        
        this.patreonAuthUrl = 'https://www.patreon.com/oauth2/authorize';
        this.patreonTokenUrl = 'https://www.patreon.com/api/oauth2/token';
        this.patreonApiUrl = 'https://www.patreon.com/api/oauth2/v2';
        
        this.tierMap = {
            100: 'friend',      // $1/month
            500: 'patron',      // $5/month
            2000: 'hero'        // $20/month
        };
    }

    /**
     * Generate Patreon OAuth login URL
     * User clicks this to link their Patreon account
     */
    getLoginUrl(state) {
        const params = new URLSearchParams({
            response_type: 'code',
            client_id: this.clientId,
            redirect_uri: this.redirectUri,
            scope: 'identity identity.memberships',
            state: state || this.generateState()
        });

        return `${this.patreonAuthUrl}?${params}`;
    }

    /**
     * Exchange authorization code for access token
     * Called on callback from Patreon
     */
    async authorizeUser(code) {
        try {
            const response = await this.makeRequest(this.patreonTokenUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: new URLSearchParams({
                    code,
                    grant_type: 'authorization_code',
                    client_id: this.clientId,
                    client_secret: this.clientSecret,
                    redirect_uri: this.redirectUri
                })
            });

            return {
                accessToken: response.access_token,
                refreshToken: response.refresh_token,
                expiresIn: response.expires_in
            };

        } catch (error) {
            console.error('OAuth authorization failed:', error);
            throw new Error('Failed to authorize with Patreon');
        }
    }

    /**
     * Refresh access token using refresh token
     */
    async refreshAccessToken(refreshToken) {
        try {
            const response = await this.makeRequest(this.patreonTokenUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: new URLSearchParams({
                    grant_type: 'refresh_token',
                    refresh_token: refreshToken,
                    client_id: this.clientId,
                    client_secret: this.clientSecret
                })
            });

            return {
                accessToken: response.access_token,
                refreshToken: response.refresh_token,
                expiresIn: response.expires_in
            };

        } catch (error) {
            console.error('Token refresh failed:', error);
            throw new Error('Failed to refresh Patreon token');
        }
    }

    /**
     * Get user identity and membership data from Patreon
     */
    async getIdentity(accessToken) {
        try {
            const response = await this.makeRequest(
                `${this.patreonApiUrl}/identity?include=memberships&fields[user]=email,full_name,image_url,created_at`,
                {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                }
            );

            const user = response.data;
            const memberships = response.included?.filter(i => i.type === 'member') || [];

            return {
                patreonId: user.id,
                email: user.attributes.email,
                fullName: user.attributes.full_name,
                imageUrl: user.attributes.image_url,
                createdAt: user.attributes.created_at,
                memberships: memberships
            };

        } catch (error) {
            console.error('Failed to get identity:', error);
            throw new Error('Failed to retrieve Patreon identity');
        }
    }

    /**
     * Check if user is an active supporter
     */
    isActiveSupporter(identity) {
        if (!identity.memberships || identity.memberships.length === 0) {
            return false;
        }

        return identity.memberships.some(membership => {
            const entitledAmount = membership.attributes.currently_entitled_amount_cents;
            return entitledAmount > 0;
        });
    }

    /**
     * Get supporter tier based on pledge amount
     */
    getSupporterTier(amountCents) {
        const tiers = Object.keys(this.tierMap)
            .map(Number)
            .sort((a, b) => b - a);

        for (const threshold of tiers) {
            if (amountCents >= threshold) {
                return this.tierMap[threshold];
            }
        }

        return null;
    }

    /**
     * Get pledge amount in cents from membership
     */
    getPledgeAmount(membership) {
        return membership.attributes.currently_entitled_amount_cents || 0;
    }

    /**
     * Verify supporter status and get tier
     */
    async verifySupporterStatus(identity) {
        if (!this.isActiveSupporter(identity)) {
            return {
                isSupporter: false,
                tier: null,
                amountCents: 0
            };
        }

        const membership = identity.memberships[0];
        const amountCents = this.getPledgeAmount(membership);
        const tier = this.getSupporterTier(amountCents);

        return {
            isSupporter: true,
            tier: tier,
            amountCents: amountCents
        };
    }

    /**
     * Full OAuth flow: code -> tokens -> identity -> supporter status
     */
    async completeOAuthFlow(code) {
        // Step 1: Get access token
        const tokens = await this.authorizeUser(code);

        // Step 2: Get user identity
        const identity = await this.getIdentity(tokens.accessToken);

        // Step 3: Check supporter status
        const supporter = await this.verifySupporterStatus(identity);

        return {
            patreonId: identity.patreonId,
            email: identity.email,
            fullName: identity.fullName,
            imageUrl: identity.imageUrl,
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            expiresAt: new Date(Date.now() + tokens.expiresIn * 1000),
            isSupporter: supporter.isSupporter,
            tier: supporter.tier,
            amountCents: supporter.amountCents
        };
    }

    /**
     * Verify webhook signature from Patreon
     */
    verifyWebhookSignature(payload, signature) {
        const crypto = require('crypto');
        const expectedSignature = crypto
            .createHmac('md5', this.webhookSecret)
            .update(payload)
            .digest('hex');

        return expectedSignature === signature;
    }

    /**
     * Handle webhook event from Patreon
     */
    parseWebhookEvent(body) {
        return {
            type: body.type,
            data: body.data,
            timestamp: new Date(body.created_at)
        };
    }

    /**
     * Generate random state for OAuth
     */
    generateState() {
        const crypto = require('crypto');
        return crypto.randomBytes(32).toString('hex');
    }

    /**
     * Make HTTP request helper
     */
    async makeRequest(url, options) {
        const response = await fetch(url, options);

        if (!response.ok) {
            const error = await response.json();
            throw new Error(`Patreon API error: ${error.errors?.[0]?.detail || error.error}`);
        }

        return response.json();
    }
}

/**
 * Supporter Status Validator
 * Check if user has supporter access
 */
class SupporterValidator {
    constructor(db, patreonService) {
        this.db = db;
        this.patreonService = patreonService;
    }

    /**
     * Check if user is an active supporter
     */
    async isSupporter(userId) {
        const supporter = await this.db.supporters.findByUserId(userId);
        
        if (!supporter) {
            return false;
        }

        if (supporter.status !== 'active') {
            return false;
        }

        // Check if token is expired
        if (supporter.tokenExpiresAt < new Date()) {
            // Token expired, need to refresh
            return await this.refreshAndValidate(userId);
        }

        return true;
    }

    /**
     * Check if user has specific tier
     */
    async hasTier(userId, requiredTier) {
        const supporter = await this.db.supporters.findByUserId(userId);

        if (!supporter || supporter.status !== 'active') {
            return false;
        }

        const tiers = ['friend', 'patron', 'hero'];
        const userTierIndex = tiers.indexOf(supporter.tier);
        const requiredIndex = tiers.indexOf(requiredTier);

        return userTierIndex >= requiredIndex;
    }

    /**
     * Refresh and validate supporter status with Patreon
     */
    async refreshAndValidate(userId) {
        try {
            const supporter = await this.db.supporters.findByUserId(userId);

            if (!supporter || !supporter.patreonAccessToken) {
                return false;
            }

            // Refresh token if needed
            if (supporter.tokenExpiresAt < new Date()) {
                const tokens = await this.patreonService.refreshAccessToken(
                    supporter.patreonRefreshToken
                );

                await this.db.supporters.update(userId, {
                    patreonAccessToken: tokens.accessToken,
                    patreonRefreshToken: tokens.refreshToken,
                    tokenExpiresAt: new Date(Date.now() + tokens.expiresIn * 1000)
                });
            }

            // Get current status
            const identity = await this.patreonService.getIdentity(
                supporter.patreonAccessToken
            );

            const status = await this.patreonService.verifySupporterStatus(identity);

            // Update database
            await this.db.supporters.update(userId, {
                isSupporter: status.isSupporter,
                tier: status.tier,
                amountCents: status.amountCents,
                lastSyncedAt: new Date()
            });

            return status.isSupporter;

        } catch (error) {
            console.error('Validation refresh failed:', error);
            return false;
        }
    }

    /**
     * Get tier value for comparison
     */
    getTierValue(tier) {
        const values = {
            'hero': 3,
            'patron': 2,
            'friend': 1,
            null: 0
        };
        return values[tier] || 0;
    }
}

/**
 * Webhook Event Handler
 * Process events from Patreon
 */
class PatreonWebhookHandler {
    constructor(db) {
        this.db = db;
    }

    /**
     * Handle pledge created event
     */
    async handlePledgeCreated(event) {
        const patronId = event.data.relationships.patron.data.id;
        const campaignId = event.data.relationships.campaign.data.id;
        const amountCents = event.data.attributes.currently_entitled_amount_cents;

        const user = await this.db.users.findByPatreonId(patronId);

        if (user) {
            await this.db.supporters.upsert({
                userId: user.id,
                tier: this.getTier(amountCents),
                amountCents: amountCents,
                status: 'active',
                syncedAt: new Date()
            });

            // Send welcome email
            await this.sendWelcomeEmail(user, amountCents);

            console.log(`✅ New supporter: ${user.email} (${amountCents / 100}$)`);
        }
    }

    /**
     * Handle pledge updated event
     */
    async handlePledgeUpdated(event) {
        const patronId = event.data.relationships.patron.data.id;
        const amountCents = event.data.attributes.currently_entitled_amount_cents;

        const user = await this.db.users.findByPatreonId(patronId);

        if (user) {
            const oldAmount = (await this.db.supporters.findByUserId(user.id))?.amountCents || 0;

            await this.db.supporters.update(user.id, {
                tier: this.getTier(amountCents),
                amountCents: amountCents,
                status: amountCents > 0 ? 'active' : 'inactive',
                syncedAt: new Date()
            });

            if (amountCents > oldAmount) {
                // Upgraded
                await this.sendUpgradeEmail(user, amountCents, oldAmount);
                console.log(`⬆️  Supporter upgraded: ${user.email}`);
            } else if (amountCents < oldAmount) {
                // Downgraded
                await this.sendDowngradeEmail(user, amountCents, oldAmount);
                console.log(`⬇️  Supporter downgraded: ${user.email}`);
            }
        }
    }

    /**
     * Handle pledge deleted event
     */
    async handlePledgeDeleted(event) {
        const patronId = event.data.relationships.patron.data.id;

        const user = await this.db.users.findByPatreonId(patronId);

        if (user) {
            await this.db.supporters.update(user.id, {
                status: 'inactive',
                endedAt: new Date()
            });

            await this.sendCancellationEmail(user);
            console.log(`❌ Support ended: ${user.email}`);
        }
    }

    /**
     * Process webhook event
     */
    async handleEvent(event) {
        switch (event.type) {
            case 'members:pledge:create':
                return this.handlePledgeCreated(event);

            case 'members:pledge:update':
                return this.handlePledgeUpdated(event);

            case 'members:pledge:delete':
                return this.handlePledgeDeleted(event);

            default:
                console.log(`Unknown event type: ${event.type}`);
        }
    }

    /**
     * Get tier for amount
     */
    getTier(amountCents) {
        if (amountCents >= 2000) return 'hero';
        if (amountCents >= 500) return 'patron';
        if (amountCents >= 100) return 'friend';
        return null;
    }

    /**
     * Email helpers (implement with your email service)
     */
    async sendWelcomeEmail(user, amountCents) {
        console.log(`📧 Welcome email to ${user.email}`);
    }

    async sendUpgradeEmail(user, newAmount, oldAmount) {
        console.log(`📧 Upgrade email to ${user.email}`);
    }

    async sendDowngradeEmail(user, newAmount, oldAmount) {
        console.log(`📧 Downgrade email to ${user.email}`);
    }

    async sendCancellationEmail(user) {
        console.log(`📧 Cancellation email to ${user.email}`);
    }
}

/**
 * Content Access Control
 * Determine what content user can access
 */
class ContentAccessControl {
    constructor(validator) {
        this.validator = validator;
    }

    /**
     * Check if user can access content by tier
     */
    async canAccessContent(userId, requiredTier) {
        if (requiredTier === 'public') {
            return true;
        }

        return this.validator.hasTier(userId, requiredTier);
    }

    /**
     * Filter content based on user tier
     */
    async filterContent(userId, contentList) {
        const filtered = [];

        for (const content of contentList) {
            const canAccess = await this.canAccessContent(
                userId,
                content.requiredTier || 'public'
            );

            if (canAccess) {
                filtered.push(content);
            }
        }

        return filtered;
    }

    /**
     * Get content metadata without showing restricted content
     */
    getContentPreview(content, hasAccess) {
        if (hasAccess) {
            return content;
        }

        return {
            id: content.id,
            title: content.title,
            requiredTier: content.requiredTier,
            preview: content.preview || null,
            isRestricted: true
        };
    }
}

// Export classes for use in Node.js backend
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        PatreonService,
        SupporterValidator,
        PatreonWebhookHandler,
        ContentAccessControl
    };
}
