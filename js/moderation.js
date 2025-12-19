/**
 * Moderation Service - Content & User Moderation
 * 
 * Handles:
 * - Content filtering (profanity, spam)
 * - Spam detection
 * - User reporting
 * - User banning/suspension
 * - Audit logging
 * 
 * Usage:
 *   const mod = new ModerationService();
 *   if (mod.isSpam(text)) console.log('Spam detected');
 *   await mod.reportPost(postId, 'harassment');
 */

class ModerationService {
    constructor() {
        // Spam patterns
        this.spamPatterns = {
            repeatedChars: /(.)\1{9,}/g,  // 10+ repeated chars
            allCaps: /^[A-Z\s!?]{20,}$/,  // All caps (20+ chars)
            manyLinks: /https?:\/\//g,    // Multiple URLs
            pills: /viagra|cialis|pharma|pharmacy/gi,
            crypto: /bitcoin|ethereum|crypto|NFT|blockchain trade/gi,
            earnings: /earn.*money|free.*money|money.*fast|get rich/gi
        };

        // Profanity list (basic - use comprehensive library in production)
        this.profanities = [
            'damn', 'hell', 'crap', 'piss', 'ass',
            // Add more as needed or use external library
        ];

        // User thresholds
        this.thresholds = {
            spamScore: 5,              // Ban if score >= 5
            reportThreshold: 3,        // Review if 3+ reports
            messageRateLimit: 10,      // 10 messages per minute max
            accountAgeMinDays: 1       // New accounts are high risk
        };

        // User spam tracking
        this.userSpamScores = new Map();    // userId -> score
        this.userMessageTimes = new Map();  // userId -> [timestamps]
        this.flaggedContent = [];           // Content awaiting review
    }

    // ==================== CONTENT FILTERING ====================

    /**
     * Check if content is spam
     * 
     * @param {string} text - Content to check
     * @param {string} authorId - User posting
     * @returns {Object} - { isSpam: bool, reasons: [] }
     */
    analyzeSpam(text, authorId = null) {
        if (!text || typeof text !== 'string') {
            return { isSpam: false, reasons: [] };
        }

        const reasons = [];
        let spamScore = 0;

        // Rule 1: Repeated characters (10+)
        if (this.spamPatterns.repeatedChars.test(text)) {
            reasons.push('Excessive repeated characters');
            spamScore += 2;
        }

        // Rule 2: All caps (rage/spam)
        if (this.spamPatterns.allCaps.test(text)) {
            reasons.push('All uppercase text');
            spamScore += 1;
        }

        // Rule 3: Too many links (3+)
        const links = (text.match(this.spamPatterns.manyLinks) || []).length;
        if (links >= 3) {
            reasons.push(`Too many links (${links})`);
            spamScore += 2;
        }

        // Rule 4: Pharmaceutical spam
        if (this.spamPatterns.pills.test(text)) {
            reasons.push('Pharmaceutical spam detected');
            spamScore += 3;
        }

        // Rule 5: Crypto spam
        if (this.spamPatterns.crypto.test(text)) {
            reasons.push('Cryptocurrency spam detected');
            spamScore += 3;
        }

        // Rule 6: Money/earnings spam
        if (this.spamPatterns.earnings.test(text)) {
            reasons.push('Money-making spam detected');
            spamScore += 3;
        }

        // Rule 7: Excessive punctuation (!!!!!!)
        if (/[!?]{5,}/.test(text)) {
            reasons.push('Excessive punctuation');
            spamScore += 1;
        }

        // Rule 8: Message rate limiting
        if (authorId) {
            const isRateLimited = this._checkRateLimit(authorId);
            if (isRateLimited) {
                reasons.push('Rate limit exceeded');
                spamScore += 2;
            }
        }

        return {
            isSpam: spamScore >= this.thresholds.spamScore,
            spamScore: spamScore,
            reasons: reasons
        };
    }

    /**
     * Filter profanity from text
     * 
     * @param {string} text - Content to filter
     * @returns {string} - Filtered text
     */
    filterProfanity(text) {
        if (!text) return text;

        let filtered = text;

        // Replace profanities with asterisks
        this.profanities.forEach(word => {
            const regex = new RegExp(`\\b${word}\\b`, 'gi');
            filtered = filtered.replace(regex, '*'.repeat(word.length));
        });

        // TODO: Use 'bad-words' npm package for comprehensive filtering
        // const Filter = require('bad-words');
        // const filter = new Filter();
        // return filter.clean(text);

        return filtered;
    }

    /**
     * Check if content has required filtering
     * 
     * @param {string} text
     * @returns {Object} - { hasVulgarities: bool, filterLevel: 'clean'|'mild'|'strong' }
     */
    assessContentSafety(text) {
        const hasProfanity = this.profanities.some(word => 
            new RegExp(`\\b${word}\\b`, 'i').test(text)
        );

        const spamAnalysis = this.analyzeSpam(text);

        const safety = {
            hasVulgarities: hasProfanity,
            isSpammy: spamAnalysis.isSpam,
            filterLevel: hasProfanity ? 'mild' : (spamAnalysis.isSpam ? 'strong' : 'clean')
        };

        return safety;
    }

    // ==================== REPORTING SYSTEM ====================

    /**
     * Flag content for manual review
     * 
     * @param {string} contentId - Post/Message ID
     * @param {string} contentType - 'post', 'message', 'comment'
     * @param {string} reason - Why it's flagged
     * @param {string} reportedBy - User reporting
     */
    flagContent(contentId, contentType, reason, reportedBy) {
        const flag = {
            id: Date.now(),
            contentId,
            contentType,
            reason,  // 'spam', 'harassment', 'nsfw', 'abuse', 'other'
            reportedBy,
            reportedAt: new Date(),
            status: 'pending',
            resolution: null
        };

        this.flaggedContent.push(flag);

        // Auto-hide if multiple reports
        const reportCount = this.flaggedContent.filter(
            f => f.contentId === contentId && f.status === 'pending'
        ).length;

        if (reportCount >= this.thresholds.reportThreshold) {
            flag.autoHidden = true;
            console.warn(`⚠️ Content auto-hidden after ${reportCount} reports`);
        }

        console.log(`📢 Content flagged: ${contentId} (${reason})`);
        return flag;
    }

    /**
     * Get pending reports for moderation
     */
    getPendingReports() {
        return this.flaggedContent.filter(f => f.status === 'pending');
    }

    /**
     * Resolve a report
     * 
     * @param {number} flagId - Flag ID
     * @param {string} action - 'approve', 'delete', 'warn'
     * @param {string} notes - Moderator notes
     */
    resolveReport(flagId, action, notes = '') {
        const flag = this.flaggedContent.find(f => f.id === flagId);

        if (!flag) {
            console.error('Flag not found:', flagId);
            return false;
        }

        flag.status = 'resolved';
        flag.resolution = action;
        flag.moderatorNotes = notes;
        flag.resolvedAt = new Date();

        console.log(`✅ Report resolved: ${flag.contentId} -> ${action}`);
        return true;
    }

    // ==================== USER MANAGEMENT ====================

    /**
     * Increase spam score for user
     * 
     * @param {string} userId
     * @param {number} points - Points to add
     */
    increaseSpamScore(userId, points = 1) {
        const current = this.userSpamScores.get(userId) || 0;
        const newScore = current + points;

        this.userSpamScores.set(userId, newScore);

        console.log(`⚠️ User spam score: ${userId} = ${newScore}/${this.thresholds.spamScore}`);

        if (newScore >= this.thresholds.spamScore) {
            console.warn(`🚫 User should be banned: ${userId}`);
            return { shouldBan: true, score: newScore };
        }

        return { shouldBan: false, score: newScore };
    }

    /**
     * Get user spam score
     */
    getSpamScore(userId) {
        return this.userSpamScores.get(userId) || 0;
    }

    /**
     * Warn user (first level action)
     * 
     * @param {string} userId
     * @param {string} reason - Why they're being warned
     */
    warnUser(userId, reason) {
        const warning = {
            id: Date.now(),
            userId,
            reason,
            warnedAt: new Date(),
            acknowledged: false
        };

        console.log(`⚠️ Warning issued to ${userId}: ${reason}`);
        return warning;
    }

    /**
     * Ban/suspend user
     * 
     * @param {string} userId
     * @param {string} reason - Ban reason
     * @param {number} duration - Duration in milliseconds (null = permanent)
     */
    banUser(userId, reason, duration = null) {
        const ban = {
            id: Date.now(),
            userId,
            reason,
            bannedAt: new Date(),
            unbanAt: duration ? new Date(Date.now() + duration) : null,
            permanent: !duration,
            status: 'active'
        };

        console.warn(`🚫 User banned: ${userId}`);
        console.warn(`   Reason: ${reason}`);
        console.warn(`   Duration: ${ban.permanent ? 'Permanent' : new Date(ban.unbanAt).toLocaleString()}`);

        return ban;
    }

    /**
     * Check if user is banned
     */
    isUserBanned(userId) {
        // TODO: Check against database of bans
        // This is client-side - real check happens on server
        return false;
    }

    // ==================== RATE LIMITING ====================

    /**
     * Check if user exceeded rate limit
     * 
     * @private
     */
    _checkRateLimit(userId) {
        const now = Date.now();
        const oneMinuteAgo = now - 60000;

        // Get user's message times
        let times = this.userMessageTimes.get(userId) || [];

        // Remove old entries
        times = times.filter(t => t > oneMinuteAgo);

        // Check limit
        if (times.length >= this.thresholds.messageRateLimit) {
            return true; // Rate limited
        }

        // Add current message
        times.push(now);
        this.userMessageTimes.set(userId, times);

        return false;
    }

    /**
     * Reset rate limit for user
     */
    resetRateLimit(userId) {
        this.userMessageTimes.delete(userId);
    }

    // ==================== AUDIT LOGGING ====================

    /**
     * Log moderation action
     * 
     * @param {string} action - What happened
     * @param {Object} details - Additional info
     */
    logAction(action, details = {}) {
        const log = {
            timestamp: new Date().toISOString(),
            action,
            details,
            userId: details.userId,
            contentId: details.contentId
        };

        console.log('📋 Moderation log:', log);

        // TODO: Send to backend for permanent storage
        // await fetch('/api/moderation/logs', { method: 'POST', body: JSON.stringify(log) });

        return log;
    }

    /**
     * Get moderation dashboard data
     */
    getDashboardData() {
        const now = Date.now();
        const oneDayAgo = now - (24 * 60 * 60 * 1000);

        const recentReports = this.flaggedContent.filter(
            f => f.reportedAt > oneDayAgo
        );

        const pendingReports = recentReports.filter(f => f.status === 'pending');

        return {
            totalFlags: this.flaggedContent.length,
            pendingReports: pendingReports.length,
            resolvedToday: recentReports.filter(f => f.status === 'resolved').length,
            topReasons: this._getTopReasons(),
            activeUsers: this.userSpamScores.size
        };
    }

    /**
     * Get most common report reasons
     * 
     * @private
     */
    _getTopReasons() {
        const reasons = {};

        this.flaggedContent.forEach(flag => {
            reasons[flag.reason] = (reasons[flag.reason] || 0) + 1;
        });

        // Sort by count
        return Object.entries(reasons)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([reason, count]) => ({ reason, count }));
    }

    // ==================== STATISTICS ====================

    /**
     * Get moderation statistics
     */
    getStats() {
        const flagsByType = {};
        const flagsByReason = {};

        this.flaggedContent.forEach(flag => {
            flagsByType[flag.contentType] = (flagsByType[flag.contentType] || 0) + 1;
            flagsByReason[flag.reason] = (flagsByReason[flag.reason] || 0) + 1;
        });

        return {
            totalFlags: this.flaggedContent.length,
            pendingFlags: this.flaggedContent.filter(f => f.status === 'pending').length,
            resolvedFlags: this.flaggedContent.filter(f => f.status === 'resolved').length,
            flagsByType,
            flagsByReason,
            usersWithSpamHistory: this.userSpamScores.size
        };
    }
}

// ==================== INTEGRATION WITH POST/CHAT ====================

// Create global moderation service
const moderation = new ModerationService();

/**
 * Enhanced addPost function with moderation
 * 
 * Usage in community.js:
 *   if (!validatePost(post)) return;
 */
async function validatePost(post) {
    // Check spam
    const spamAnalysis = moderation.analyzeSpam(post.content, post.authorId);

    if (spamAnalysis.isSpam) {
        console.warn('🚫 Post rejected as spam:', spamAnalysis.reasons);
        moderation.logAction('post_rejected_spam', {
            authorId: post.authorId,
            reasons: spamAnalysis.reasons
        });
        return false;
    }

    // Filter profanity
    post.content = moderation.filterProfanity(post.content);

    // Assess safety
    const safety = moderation.assessContentSafety(post.content);

    if (safety.isSpammy) {
        // Flag for review
        moderation.flagContent(post.id, 'post', 'potentially_spam', 'auto-filter');
    }

    return true;
}

/**
 * Enhanced sendChat function with moderation
 * 
 * Usage in chat.js:
 *   if (!validateMessage(message)) return;
 */
async function validateMessage(message) {
    // Rate limit check
    const isRateLimited = moderation._checkRateLimit(message.authorId);

    if (isRateLimited) {
        console.error('Rate limit exceeded');
        moderation.logAction('rate_limit_exceeded', { userId: message.authorId });
        return false;
    }

    // Spam check
    const spamAnalysis = moderation.analyzeSpam(message.text, message.authorId);

    if (spamAnalysis.isSpam) {
        console.warn('Message rejected as spam');
        moderation.increaseSpamScore(message.authorId, spamAnalysis.spamScore);
        moderation.logAction('message_rejected_spam', {
            userId: message.authorId,
            reasons: spamAnalysis.reasons
        });
        return false;
    }

    // Filter profanity
    message.text = moderation.filterProfanity(message.text);

    return true;
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ModerationService;
}
