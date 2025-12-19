/**
 * Navigation Injector - Quick Fix for Code Duplication
 * 
 * Dynamically loads header and footer from single source files
 * Eliminates need to maintain header/footer in 12+ separate HTML files
 * 
 * Usage:
 *   Add this to your HTML pages:
 *   <div id="header"></div>
 *   <div id="footer"></div>
 *   
 *   Then include this script:
 *   <script src="/js/nav-injector.js"></script>
 * 
 * Advantages:
 *   - Update navigation in ONE place
 *   - Consistent header/footer across all pages
 *   - No code duplication
 *   - No build step required
 */

class NavInjector {
    constructor(config = {}) {
        this.headerSelector = config.headerSelector || '#header';
        this.footerSelector = config.footerSelector || '#footer';
        this.headerFile = config.headerFile || 'components/header.html';
        this.footerFile = config.footerFile || 'components/footer.html';
        this.isInjected = false;
    }

    /**
     * Inject header and footer into page
     */
    async inject() {
        try {
            await Promise.all([
                this.injectHeader(),
                this.injectFooter()
            ]);

            // Initialize navigation
            this.initNavigation();
            this.updateUserInfo();
            this.highlightCurrentPage();

            this.isInjected = true;
            console.log('✅ Navigation injected');

        } catch (error) {
            console.error('❌ Failed to inject navigation:', error);
        }
    }

    /**
     * Inject header
     * 
     * @private
     */
    async injectHeader() {
        try {
            const response = await fetch(this.headerFile);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const html = await response.text();
            const headerElement = document.querySelector(this.headerSelector);
            
            if (headerElement) {
                headerElement.innerHTML = html;
            }

            console.log('✅ Header injected');
            return true;

        } catch (error) {
            console.error('Failed to load header:', error);
            throw error;
        }
    }

    /**
     * Inject footer
     * 
     * @private
     */
    async injectFooter() {
        try {
            const response = await fetch(this.footerFile);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const html = await response.text();
            const footerElement = document.querySelector(this.footerSelector);
            
            if (footerElement) {
                footerElement.innerHTML = html;
            }

            console.log('✅ Footer injected');
            return true;

        } catch (error) {
            console.error('Failed to load footer:', error);
            throw error;
        }
    }

    /**
     * Initialize navigation event listeners
     * 
     * @private
     */
    initNavigation() {
        const navLinks = document.querySelectorAll('nav a');
        
        navLinks.forEach(link => {
            // Add smooth transition on click
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                
                // Only apply animation to internal links
                if (href && !href.startsWith('http') && !href.startsWith('mailto:')) {
                    e.preventDefault();
                    
                    // Add fade effect
                    document.body.style.opacity = '0.7';
                    
                    // Navigate after brief delay
                    setTimeout(() => {
                        window.location.href = href;
                    }, 150);
                }
            });

            // Prefetch on hover (if using router)
            link.addEventListener('mouseover', () => {
                const href = link.getAttribute('href');
                
                if (window.router && href && href.startsWith('#')) {
                    const path = href.slice(1);
                    window.router.prefetch(path);
                }
            });
        });

        // Restore opacity on load
        window.addEventListener('load', () => {
            document.body.style.opacity = '1';
        });

        console.log('✅ Navigation events initialized');
    }

    /**
     * Update user info in navigation
     * Shows logged-in user's name instead of "Login" button
     * 
     * @private
     */
    updateUserInfo() {
        const user = window.auth?.getUser?.();
        const userNav = document.getElementById('userNav');
        const loginBtn = document.getElementById('loginBtn');
        const logoutBtn = document.getElementById('logoutBtn');
        const userEmail = document.getElementById('userEmail');

        if (user) {
            // User is logged in
            if (loginBtn) loginBtn.style.display = 'none';
            if (userNav) userNav.style.display = 'inline-block';
            if (userEmail) {
                userEmail.textContent = user.username || user.email;
            }
            if (logoutBtn) {
                logoutBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    if (window.auth) {
                        window.auth.logout();
                    }
                });
            }
        } else {
            // User not logged in
            if (loginBtn) loginBtn.style.display = 'inline-block';
            if (userNav) userNav.style.display = 'none';
        }

        console.log('✅ User info updated');
    }

    /**
     * Highlight current page in navigation
     * 
     * @private
     */
    highlightCurrentPage() {
        // Get current page filename
        const currentFile = window.location.pathname.split('/').pop() || 'home.html';
        const currentPage = currentFile.replace('.html', '');

        // Remove active class from all links
        document.querySelectorAll('nav a').forEach(link => {
            link.classList.remove('active');
        });

        // Add active class to current page link
        const currentLink = document.querySelector(
            `nav a[href*="${currentPage}"]`
        );

        if (currentLink) {
            currentLink.classList.add('active');
        }

        console.log('✅ Current page highlighted:', currentPage);
    }

    /**
     * Get current file path (relative or absolute)
     * 
     * @private
     */
    getCurrentPath() {
        return window.location.pathname;
    }

    /**
     * Build absolute path from relative
     * Needed because header/footer might be loaded from different folder
     * 
     * @private
     */
    getAbsolutePath(relativePath) {
        const currentPath = this.getCurrentPath();
        const currentDir = currentPath.substring(0, currentPath.lastIndexOf('/'));
        
        return currentDir + '/' + relativePath;
    }
}

// ==================== AUTO-INJECT ON PAGE LOAD ====================

const navInjector = new NavInjector({
    headerSelector: '#header',
    footerSelector: '#footer',
    headerFile: 'components/header.html',
    footerFile: 'components/footer.html'
});

// Inject when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        navInjector.inject();
    });
} else {
    // DOM already loaded
    navInjector.inject();
}

// Also re-inject on page show (for browser back button)
window.addEventListener('pageshow', () => {
    if (navInjector.isInjected) {
        navInjector.updateUserInfo();
        navInjector.highlightCurrentPage();
    }
});

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NavInjector;
}
