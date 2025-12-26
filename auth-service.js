/**
 * AuthService - Secure Authentication
 * 
 * Implements best practices:
 * - Uses token-based authentication (JWT)
 * - Never stores passwords locally
 * - Server-side password verification
 * - Email verification
 * - Token expiration and refresh
 * - Protected API requests
 * 
 * Works with StorageService abstraction layer
 * Switches between localStorage (demo) and backend (production)
 */

class AuthService {
    constructor(storage) {
        this.storage = storage;
        this.tokenKey = 'authToken';
        this.userKey = 'pixellumoUser';
        this.refreshTokenKey = 'refreshToken';
    }

    // ==================== AUTHENTICATION ====================

    /**
     * Login user with email and password
     * 
     * Secure approach:
     * 1. Send credentials to backend over HTTPS
     * 2. Backend verifies password against hash
     * 3. Backend returns JWT token (not password)
     * 4. Client stores token (not password)
     * 5. Token sent with every request
     * 
     * @param {string} email - User email
     * @param {string} password - User password
     * @returns {Promise<{token, user}>} - JWT token and user data
     */
    async login(email, password) {
        // Validate input
        if (!email || !password) {
            throw new Error('Email and password are required');
        }

        if (!this.isValidEmail(email)) {
            throw new Error('Invalid email format');
        }

        if (password.length < 1) {
            throw new Error('Password cannot be empty');
        }

        try {
            // Call storage service (which calls backend)
            const response = await this.storage.login(email, password);

            if (!response.token) {
                throw new Error('No token returned from server');
            }

            // ✅ Store token (not password)
            this.setToken(response.token);

            // Store refresh token if provided
            if (response.refreshToken) {
                this.setRefreshToken(response.refreshToken);
            }

            // ✅ Store user info WITHOUT password
            this.setUser({
                id: response.user.id,
                email: response.user.email,
                username: response.user.username,
                avatar: response.user.avatar,
                role: response.user.role,
                verified: response.user.verified || false
            });

            // Update navigation
            this.updateNavigation(response.user);

            return response;
        } catch (error) {
            // Generic error message (don't reveal if email exists)
            console.error('Login error:', error);
            throw new Error('Login failed. Please check your credentials.');
        }
    }

    /**
     * Register new user
     * 
     * @param {string} email - User email
     * @param {string} password - User password
     * @param {string} username - Display name
     * @returns {Promise<{message}>}
     */
    async register(email, password, username) {
        // Validate input
        if (!email || !password || !username) {
            throw new Error('All fields are required');
        }

        if (!this.isValidEmail(email)) {
            throw new Error('Invalid email format');
        }

        if (password.length < 6) {
            throw new Error('Password must be at least 6 characters');
        }

        if (username.length < 3) {
            throw new Error('Username must be at least 3 characters');
        }

        try {
            const response = await this.storage.register(email, password, username);
            return response;
        } catch (error) {
            console.error('Registration error:', error);
            throw new Error('Registration failed. Please try again.');
        }
    }

    /**
     * Verify email with token from email link
     * 
     * @param {string} verificationToken - Token from email
     * @returns {Promise<{message}>}
     */
    async verifyEmail(verificationToken) {
        if (!verificationToken) {
            throw new Error('Verification token required');
        }

        try {
            const response = await this.storage.verifyEmail(verificationToken);
            
            // Update user's verified status
            const user = this.getUser();
            if (user) {
                user.verified = true;
                this.setUser(user);
            }
            
            return response;
        } catch (error) {
            console.error('Email verification error:', error);
            throw new Error('Email verification failed');
        }
    }

    /**
     * Request password reset email
     * 
     * @param {string} email - User email
     * @returns {Promise<{message}>}
     */
    async requestPasswordReset(email) {
        if (!email || !this.isValidEmail(email)) {
            throw new Error('Valid email required');
        }

        try {
            const response = await this.storage.requestPasswordReset(email);
            return response;
        } catch (error) {
            // Don't reveal if email exists
            console.error('Password reset error:', error);
            return { message: 'If email exists, check inbox for reset link' };
        }
    }

    /**
     * Reset password with reset token
     * 
     * @param {string} resetToken - Token from reset email
     * @param {string} newPassword - New password
     * @returns {Promise<{message}>}
     */
    async resetPassword(resetToken, newPassword) {
        if (!resetToken || !newPassword) {
            throw new Error('Reset token and new password required');
        }

        if (newPassword.length < 8) {
            throw new Error('Password must be at least 8 characters');
        }

        try {
            const response = await this.storage.resetPassword(resetToken, newPassword);
            return response;
        } catch (error) {
            console.error('Password reset error:', error);
            throw new Error('Password reset failed');
        }
    }

    /**
     * Logout user
     */
    async logout() {
        // Notify backend (for logout logging)
        try {
            const token = this.getToken();
            if (token && this.storage.useBackend) {
                await this.storage.logout();
            }
        } catch (error) {
            console.error('Logout error:', error);
            // Continue logout even if server call fails
        }

        // Clear local auth data
        this.clearAuth();

        // Update navigation
        this.updateNavigation(null);

        // Redirect to home
        if (window.location.pathname !== '/') {
            window.location.href = '/';
        }
    }

    // ==================== TOKEN MANAGEMENT ====================

    /**
     * Get current auth token
     * Verifies token is still valid before returning
     * 
     * @returns {string|null} - JWT token or null if invalid/expired
     */
    getToken() {
        const token = localStorage.getItem(this.tokenKey);

        if (!token) {
            return null;
        }

        // Check if token is expired
        if (this.isTokenExpired(token)) {
            // Try to refresh
            return this.refreshToken();
        }

        return token;
    }

    /**
     * Set auth token
     * 
     * @param {string} token - JWT token
     */
    setToken(token) {
        localStorage.setItem(this.tokenKey, token);
    }

    /**
     * Get refresh token
     * 
     * @returns {string|null}
     */
    getRefreshToken() {
        return localStorage.getItem(this.refreshTokenKey);
    }

    /**
     * Set refresh token
     * 
     * @param {string} token - Refresh token
     */
    setRefreshToken(token) {
        localStorage.setItem(this.refreshTokenKey, token);
    }

    /**
     * Refresh access token using refresh token
     * 
     * Backend should provide:
     * POST /api/auth/refresh
     * Body: { refreshToken }
     * Response: { token, refreshToken }
     */
    async refreshToken() {
        const refreshToken = this.getRefreshToken();

        if (!refreshToken) {
            this.logout();
            return null;
        }

        try {
            const response = await fetch('http://localhost:3000/api/auth/refresh', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ refreshToken })
            });

            if (!response.ok) {
                throw new Error('Token refresh failed');
            }

            const data = await response.json();
            this.setToken(data.token);

            if (data.refreshToken) {
                this.setRefreshToken(data.refreshToken);
            }

            return data.token;
        } catch (error) {
            console.error('Token refresh error:', error);
            this.logout();
            return null;
        }
    }

    /**
     * Check if token is expired
     * 
     * JWT tokens contain: header.payload.signature
     * Payload contains: { userId, email, exp, iat }
     * exp = expiration timestamp (seconds since epoch)
     * 
     * @param {string} token - JWT token
     * @returns {boolean} - True if expired
     */
    isTokenExpired(token) {
        try {
            // Decode token (JWT format: xxx.yyy.zzz)
            const parts = token.split('.');
            if (parts.length !== 3) {
                return true;
            }

            // Decode payload (add padding if needed)
            const payload = parts[1];
            const padded = payload + '='.repeat(4 - payload.length % 4);
            const decoded = JSON.parse(atob(padded));

            // Check expiration
            if (!decoded.exp) {
                return true; // No expiration = invalid
            }

            const expirationTime = decoded.exp * 1000; // Convert to milliseconds
            return Date.now() >= expirationTime;
        } catch (error) {
            console.error('Token decode error:', error);
            return true; // Assume expired if can't decode
        }
    }

    // ==================== USER MANAGEMENT ====================

    /**
     * Get current logged-in user
     * 
     * @returns {Object|null} - User object or null if not logged in
     */
    getUser() {
        const userJson = sessionStorage.getItem(this.userKey);
        
        if (!userJson) {
            return null;
        }

        try {
            return JSON.parse(userJson);
        } catch (error) {
            console.error('User parse error:', error);
            return null;
        }
    }

    /**
     * Set current user (internal use)
     * 
     * @param {Object} user - User object (without password!)
     */
    setUser(user) {
        if (user) {
            // ✅ IMPORTANT: Never store password
            delete user.password;
            delete user.passwordHash;
            
            sessionStorage.setItem(this.userKey, JSON.stringify(user));
        } else {
            sessionStorage.removeItem(this.userKey);
        }
    }

    /**
     * Check if user is logged in
     * 
     * @returns {boolean}
     */
    isLoggedIn() {
        const token = localStorage.getItem(this.tokenKey);
        const user = sessionStorage.getItem(this.userKey);
        
        return !!(token && user && !this.isTokenExpired(token));
    }

    /**
     * Update user profile
     * 
     * @param {Object} updates - Fields to update (username, avatar, etc.)
     * @returns {Promise<{user}>}
     */
    async updateProfile(updates) {
        if (!this.isLoggedIn()) {
            throw new Error('Not logged in');
        }

        // Don't allow password change here
        delete updates.password;
        delete updates.passwordHash;

        try {
            const token = this.getToken();
            const response = await fetch('http://localhost:3000/api/user/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(updates)
            });

            if (!response.ok) {
                throw new Error('Profile update failed');
            }

            const data = await response.json();
            
            // Update local user data
            const user = this.getUser();
            const updated = { ...user, ...data.user };
            this.setUser(updated);

            return data;
        } catch (error) {
            console.error('Profile update error:', error);
            throw error;
        }
    }

    // ==================== PROTECTED API REQUESTS ====================

    /**
     * Make authenticated API request (includes token)
     * 
     * Usage:
     *   const posts = await auth.fetch('/api/posts');
     *   const result = await auth.fetch('/api/posts', {
     *     method: 'POST',
     *     body: JSON.stringify({ content: 'Hello' })
     *   });
     * 
     * @param {string} endpoint - API endpoint (relative)
     * @param {Object} options - Fetch options
     * @returns {Promise<any>} - API response
     */
    async fetch(endpoint, options = {}) {
        const token = this.getToken();

        if (!token) {
            throw new Error('Not authenticated');
        }

        // Ensure base URL
        const url = endpoint.startsWith('http') 
            ? endpoint 
            : `http://localhost:3000${endpoint}`;

        // Add auth header
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            ...options.headers
        };

        try {
            const response = await window.fetch(url, {
                ...options,
                headers
            });

            if (response.status === 401) {
                // Token invalid or expired
                this.logout();
                throw new Error('Session expired. Please login again.');
            }

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'API request failed');
            }

            return await response.json();
        } catch (error) {
            console.error(`API error (${endpoint}):`, error);
            throw error;
        }
    }

    // ==================== UTILITIES ====================

    /**
     * Validate email format
     * 
     * @param {string} email
     * @returns {boolean}
     */
    isValidEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    /**
     * Clear auth data
     * 
     * @private
     */
    clearAuth() {
        localStorage.removeItem(this.tokenKey);
        localStorage.removeItem(this.refreshTokenKey);
        sessionStorage.removeItem(this.userKey);
    }

    /**
     * Update navigation bar based on login state
     * 
     * @private
     */
    updateNavigation(user) {
        const loginBtn = document.getElementById('loginBtn');
        const logoutBtn = document.getElementById('logoutBtn');
        const userNav = document.getElementById('userNav');
        const userEmail = document.getElementById('userEmail');

        if (user) {
            // User is logged in
            if (loginBtn) loginBtn.style.display = 'none';
            if (logoutBtn) logoutBtn.style.display = 'inline-block';
            if (userNav) {
                userNav.style.display = 'inline-block';
                if (userEmail) {
                    userEmail.textContent = user.username || user.email;
                }
            }
        } else {
            // User is logged out
            if (loginBtn) loginBtn.style.display = 'inline-block';
            if (logoutBtn) logoutBtn.style.display = 'none';
            if (userNav) userNav.style.display = 'none';
        }
    }

    /**
     * Check auth status and redirect if needed
     * 
     * Usage: Call on protected pages
     *   if (!auth.isLoggedIn()) {
     *     auth.redirectToLogin();
     *   }
     */
    redirectToLogin() {
        window.location.href = '/index.html?next=' + encodeURIComponent(window.location.pathname);
    }

    /**
     * Get security info (for debugging)
     * 
     * @returns {Object}
     */
    getSecurityInfo() {
        const token = this.getToken();
        const decoded = token ? this.decodeToken(token) : null;

        return {
            isLoggedIn: this.isLoggedIn(),
            hasToken: !!token,
            tokenExpired: token ? this.isTokenExpired(token) : null,
            tokenExpiration: decoded ? new Date(decoded.exp * 1000) : null,
            user: this.getUser()
        };
    }

    /**
     * Decode JWT token (for inspection only)
     * 
     * @private
     */
    decodeToken(token) {
        try {
            const parts = token.split('.');
            const payload = parts[1];
            const padded = payload + '='.repeat(4 - payload.length % 4);
            return JSON.parse(atob(padded));
        } catch (error) {
            return null;
        }
    }
}

// Create global instance
const auth = new AuthService(storage);

// Auto-logout on tab close (optional - good security practice)
window.addEventListener('beforeunload', () => {
    // Could log user out, but that's too aggressive
    // Instead, just log the session end
    console.log('Session may end');
});

// Periodic token refresh (every 50 minutes for 1-hour tokens)
setInterval(() => {
    if (auth.isLoggedIn()) {
        auth.refreshToken();
    }
}, 50 * 60 * 1000);
