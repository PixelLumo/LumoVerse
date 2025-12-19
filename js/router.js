/**
 * Router - Simple Single-Page App Router
 * 
 * Enables SPA navigation without page reloads
 * Handles URL history, page transitions, and dynamic content loading
 * 
 * Usage:
 *   // Register routes
 *   router.register('home', 'pages/home.html', 'Home');
 *   router.register('community', 'pages/community.html', 'Community');
 *   
 *   // Navigate
 *   router.navigate('community');
 *   
 *   // Or use link with hash
 *   <a href="#community">Community</a>
 */

class Router {
    constructor(config = {}) {
        this.routes = new Map();
        this.currentPage = null;
        this.mainContainer = config.mainContainer || '#main';
        this.navSelector = config.navSelector || 'nav a';
        this.loadingIndicator = config.loadingIndicator || null;
        this.cache = new Map(); // Cache loaded pages
        this.cacheEnabled = config.cacheEnabled !== false;
        this.prefetchQueue = [];
        this.pageTransitionDelay = config.pageTransitionDelay || 0;
        
        this.init();
    }

    /**
     * Initialize router
     * 
     * @private
     */
    init() {
        // Get main container element
        if (typeof this.mainContainer === 'string') {
            this.mainContainer = document.querySelector(this.mainContainer);
        }

        // Listen for navigation clicks
        this.bindNavigation();

        // Listen for back/forward buttons
        window.addEventListener('popstate', (e) => {
            if (e.state && e.state.path) {
                this.navigate(e.state.path, false);
            }
        });

        // Navigate to current hash on load
        window.addEventListener('load', () => {
            const path = this.getPathFromHash();
            if (path) {
                this.navigate(path, false);
            }
        });

        console.log('✅ Router initialized');
    }

    /**
     * Register a route
     * 
     * @param {string} path - Route path (used in #hash)
     * @param {string} htmlFile - HTML file to load
     * @param {string} title - Page title
     * @param {Object} options - Additional options
     */
    register(path, htmlFile, title, options = {}) {
        this.routes.set(path, {
            path,
            htmlFile,
            title,
            requireAuth: options.requireAuth || false,
            requireVerified: options.requireVerified || false,
            scrollTop: options.scrollTop !== false,
            ...options
        });

        return this;
    }

    /**
     * Navigate to a page
     * 
     * @param {string} path - Route path
     * @param {boolean} updateHistory - Update browser history
     */
    async navigate(path, updateHistory = true) {
        // Check if route exists
        const route = this.routes.get(path);
        if (!route) {
            console.error('❌ Route not found:', path);
            this.showError(`Page "${path}" not found`);
            return false;
        }

        // Check authentication requirements
        if (!this.checkPermissions(route)) {
            console.warn('⚠️ Access denied:', path);
            this.redirectToLogin();
            return false;
        }

        // Show loading indicator
        this.showLoading(true);

        try {
            // Load page content
            const html = await this.loadPage(route.htmlFile);

            // Apply transition delay if specified
            if (this.pageTransitionDelay > 0) {
                await this.delay(this.pageTransitionDelay);
            }

            // Update page content
            this.mainContainer.innerHTML = html;

            // Update page title
            document.title = `${route.title} - PixelLumo`;

            // Scroll to top
            if (route.scrollTop) {
                window.scrollTo(0, 0);
            }

            // Update active nav link
            this.updateActiveLink(path);

            // Initialize page-specific code
            this.initPage(path);

            // Update browser history
            if (updateHistory) {
                window.history.pushState({ path }, route.title, '#' + path);
            } else {
                // Still update hash without history entry
                window.location.hash = path;
            }

            this.currentPage = path;
            this.showLoading(false);

            console.log(`✅ Navigated to: ${path}`);
            return true;

        } catch (error) {
            console.error('❌ Navigation failed:', error);
            this.showError(`Failed to load page: ${error.message}`);
            this.showLoading(false);
            return false;
        }
    }

    /**
     * Load page HTML
     * Caches result for faster repeat visits
     * 
     * @private
     */
    async loadPage(htmlFile) {
        // Check cache first
        if (this.cacheEnabled && this.cache.has(htmlFile)) {
            console.log(`📦 Loaded from cache: ${htmlFile}`);
            return this.cache.get(htmlFile);
        }

        try {
            const response = await fetch(htmlFile);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const html = await response.text();

            // Cache result
            if (this.cacheEnabled) {
                this.cache.set(htmlFile, html);
            }

            return html;

        } catch (error) {
            console.error(`Failed to load ${htmlFile}:`, error);
            throw error;
        }
    }

    /**
     * Prefetch a page (load in background)
     * Useful for links the user might click
     * 
     * @param {string} path - Route to prefetch
     */
    prefetch(path) {
        const route = this.routes.get(path);
        if (!route) return;

        // Add to prefetch queue if not already loaded
        if (!this.cache.has(route.htmlFile)) {
            this.prefetchQueue.push(route.htmlFile);
            
            // Load in background (low priority)
            this.loadPage(route.htmlFile)
                .then(() => {
                    console.log(`📥 Prefetched: ${path}`);
                    this.prefetchQueue = this.prefetchQueue.filter(
                        f => f !== route.htmlFile
                    );
                })
                .catch(err => console.log('Prefetch failed:', err));
        }
    }

    /**
     * Check if user has permission to access route
     * 
     * @private
     */
    checkPermissions(route) {
        const user = auth?.getUser?.();

        if (route.requireAuth && !user) {
            console.warn('Route requires authentication');
            return false;
        }

        if (route.requireVerified && user && !user.verified) {
            console.warn('Route requires email verification');
            return false;
        }

        return true;
    }

    /**
     * Redirect unauthenticated user to login
     * 
     * @private
     */
    redirectToLogin() {
        window.location.href = '/index.html';
    }

    /**
     * Initialize page-specific code
     * 
     * @private
     */
    initPage(path) {
        // Call page initialization functions if they exist
        const initFunctionName = `init${this.capitalize(path)}`;
        
        if (window[initFunctionName] && typeof window[initFunctionName] === 'function') {
            try {
                window[initFunctionName]();
                console.log(`🎯 Initialized: ${initFunctionName}`);
            } catch (error) {
                console.error(`Error initializing page: ${error}`);
            }
        }

        // Lazy load page-specific scripts
        this.loadPageScript(path);

        // Re-bind any dynamic content handlers
        this.rebindDynamicHandlers();
    }

    /**
     * Load page-specific JavaScript
     * 
     * @private
     */
    loadPageScript(path) {
        const scripts = {
            'community': '../js/community.js',
            'chat': '../js/chat-socket.js',
            'messaging': '../js/messaging.js',
            'gallery': '../js/gallery.js',
            'blog': '../js/blog.js',
            'tutorials': '../js/tutorials.js',
            'leaderboard': '../js/leaderboard.js',
            'achievements': '../js/achievements.js',
            'profile': '../js/profile.js',
            'dashboard': '../js/dashboard.js'
        };

        if (scripts[path]) {
            // Scripts already loaded globally, just call init
            // In future, could use dynamic import for code splitting
        }
    }

    /**
     * Re-bind handlers for dynamically loaded content
     * 
     * @private
     */
    rebindDynamicHandlers() {
        // Add typing indicator on focus
        document.querySelectorAll('textarea, input[type="text"]').forEach(el => {
            el.addEventListener('focus', () => {
                if (chatSocket && chatSocket.isConnected) {
                    chatSocket.sendTyping();
                }
            });
        });

        // Re-bind form submissions
        document.querySelectorAll('form').forEach(form => {
            form.addEventListener('submit', this.handleFormSubmit.bind(this));
        });
    }

    /**
     * Handle form submissions
     * 
     * @private
     */
    handleFormSubmit(e) {
        // Prevent page reload
        // Let page-specific JavaScript handle
        console.log('Form submitted:', e.target);
    }

    /**
     * Bind navigation links
     * 
     * @private
     */
    bindNavigation() {
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            
            if (!link) return;

            const href = link.getAttribute('href');
            
            // Check if it's a route link (starts with #)
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const path = href.slice(1);
                this.navigate(path);
            }
        });

        // Prefetch on hover
        document.addEventListener('mouseover', (e) => {
            const link = e.target.closest('a[href^="#"]');
            if (link) {
                const path = link.getAttribute('href').slice(1);
                this.prefetch(path);
            }
        });
    }

    /**
     * Update active link in navigation
     * 
     * @private
     */
    updateActiveLink(path) {
        // Remove active class from all links
        document.querySelectorAll(this.navSelector).forEach(link => {
            link.classList.remove('active');
        });

        // Add active class to current link
        const activeLink = document.querySelector(
            `${this.navSelector}[href="#${path}"]`
        );
        
        if (activeLink) {
            activeLink.classList.add('active');
        }
    }

    /**
     * Show/hide loading indicator
     * 
     * @private
     */
    showLoading(show) {
        if (!this.loadingIndicator) return;

        const element = typeof this.loadingIndicator === 'string'
            ? document.querySelector(this.loadingIndicator)
            : this.loadingIndicator;

        if (element) {
            element.style.display = show ? 'block' : 'none';
        }
    }

    /**
     * Show error message
     * 
     * @private
     */
    showError(message) {
        if (this.mainContainer) {
            this.mainContainer.innerHTML = `
                <div class="error-container">
                    <h1>❌ Error</h1>
                    <p>${message}</p>
                    <a href="#home">← Back to Home</a>
                </div>
            `;
        }
    }

    /**
     * Get path from current hash
     * 
     * @private
     */
    getPathFromHash() {
        const hash = window.location.hash.slice(1);
        return hash || null;
    }

    /**
     * Get current page path
     */
    getCurrentPage() {
        return this.currentPage;
    }

    /**
     * Get cache statistics
     */
    getCacheStats() {
        return {
            cached: this.cache.size,
            routes: this.routes.size,
            prefetching: this.prefetchQueue.length
        };
    }

    /**
     * Clear cache
     */
    clearCache() {
        this.cache.clear();
        console.log('Cache cleared');
    }

    /**
     * Utility: Capitalize string
     * 
     * @private
     */
    capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    /**
     * Utility: Delay
     * 
     * @private
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// ==================== GLOBAL SETUP ====================

// Create global router instance
const router = new Router({
    mainContainer: 'main',
    navSelector: 'nav a',
    loadingIndicator: '.loading-spinner',
    cacheEnabled: true,
    pageTransitionDelay: 0  // Set to 300 for transition effect
});

// Register all routes
function setupRoutes() {
    router.register('home', 'pages/home.html', 'Home');
    router.register('dashboard', 'pages/dashboard.html', 'Dashboard', { requireAuth: true });
    router.register('community', 'pages/community.html', 'Community', { requireAuth: true });
    router.register('chat', 'pages/chat.html', 'Chat', { requireAuth: true });
    router.register('messaging', 'pages/messaging.html', 'Messages', { requireAuth: true });
    router.register('tutorials', 'pages/tutorials.html', 'Tutorials', { requireAuth: true });
    router.register('gallery', 'pages/gallery.html', 'Gallery', { requireAuth: true });
    router.register('blog', 'pages/blog.html', 'Blog');
    router.register('leaderboard', 'pages/leaderboard.html', 'Leaderboard', { requireAuth: true });
    router.register('achievements', 'pages/achievements.html', 'Achievements', { requireAuth: true });
    router.register('profile', 'pages/profile.html', 'Profile', { requireAuth: true });
    router.register('contact', 'pages/contact.html', 'Contact');
}

// Setup routes when page loads
window.addEventListener('load', setupRoutes);

// CSS for active link indicator
const style = document.createElement('style');
style.textContent = `
    nav a.active {
        border-bottom: 3px solid #ff1493;
        font-weight: bold;
    }
    
    .loading-spinner {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 9999;
    }
    
    .error-container {
        text-align: center;
        padding: 50px;
        color: #ff1493;
    }
    
    .error-container a {
        color: #ff1493;
        text-decoration: underline;
        cursor: pointer;
    }
`;
document.head.appendChild(style);

// Export for use in modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Router;
}
