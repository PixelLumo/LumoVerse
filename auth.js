/**
 * PixelLumo Authentication System
 * Handles user login/logout and session management
 */

// Check authentication on page load
document.addEventListener('DOMContentLoaded', () => {
    const isAuthPage = document.body.className.includes('auth-page') || 
                      window.location.pathname.includes('login') || 
                      window.location.pathname.includes('signup') ||
                      window.location.pathname.includes('index.html');
    
    // Only redirect to login if specifically on login/signup page and not authenticated
    // Don't redirect from other pages - allow public access
    if (isAuthPage) {
        const userSession = sessionStorage.getItem('pixellumoUser');
        if (!userSession) {
            // Only redirect if trying to access protected auth pages
            const pathCheck = window.location.pathname.includes('profile') || 
                            window.location.pathname.includes('dashboard');
            if (pathCheck) {
                window.location.href = window.APP_BASE + 'index.html';
            }
        } else {
            updateNavigation(JSON.parse(userSession));
        }
    }
    
    // Contact form submit alert
    const form = document.getElementById("contactForm");
    if (form) {
        form.addEventListener("submit", e => {
            e.preventDefault();
            alert("Thank you for your message! We'll get back to you soon.");
            form.reset();
        });
    }
});

// Admin user configuration - Set your username here to grant admin rights
const ADMIN_USER = 'lumo'; // taineh42@gmail.com | username: lumo - Admin account

/**
 * Handle user login
 * @param {string} email - User email
 * @param {string} username - User username
 * @param {boolean} remember - Remember me checkbox
 */
function loginUser(email, username, remember = false) {
    const usernameToUse = username || email.split('@')[0];
    
    // Check if user is admin
    const isAdmin = usernameToUse.toLowerCase() === ADMIN_USER.toLowerCase();
    
    const userData = {
        email: email,
        username: usernameToUse,
        loginTime: new Date().toISOString(),
        isAdmin: isAdmin // Add admin flag
        // NOTE: Achievements are now stored on the server database
    };
    
    // Notify if user is admin
    if (isAdmin) {
        setTimeout(() => {
            alert('🔒 Admin privileges granted!');
        }, 500);
    }
    
    // Store in sessionStorage (cleared when browser closes)
    sessionStorage.setItem('pixellumoUser', JSON.stringify(userData));
    
    // NOTE: "Remember me" is handled by server-side JWT token persistence
    // Auth token is automatically stored by login endpoint
    
    return userData;
}

/**
 * Handle user logout
 */
async function logoutUser() {
    console.log('[logoutUser] Called');
    // Try to use storage-service.js logout if available
    if (window.StorageService && typeof window.StorageService.logout === 'function') {
        try {
            console.log('[logoutUser] Using StorageService.logout');
            await window.StorageService.logout();
        } catch (e) {
            console.error('[logoutUser] StorageService.logout error:', e);
        }
    } else {
        console.warn('[logoutUser] StorageService.logout not available');
    }
    sessionStorage.removeItem('pixellumoUser');
    localStorage.removeItem('authToken');
    localStorage.removeItem('pixellumoUser');
    console.log('[logoutUser] Cleared session/localStorage');
    const loginPage = window.APP_BASE ? window.APP_BASE + 'login.html' : 'login.html';
    console.log('[logoutUser] Redirecting to', loginPage);
    window.location.href = loginPage;
}

/**
 * Get current user session
 * @returns {Object|null} User data or null if not logged in
 */
function getCurrentUser() {
    const sessionUser = sessionStorage.getItem('pixellumoUser');
    if (sessionUser) {
        return JSON.parse(sessionUser);
    }
    
    // Check for remembered user
    const rememberedUser = localStorage.getItem('pixellumoRemember');
    if (rememberedUser) {
        const userData = JSON.parse(rememberedUser);
        sessionStorage.setItem('pixellumoUser', JSON.stringify(userData));
        return userData;
    }
    
    return null;
}

/**
 * Check if current user is admin
 * @returns {boolean} True if current user is admin
 */
function isUserAdmin() {
    const currentUser = getCurrentUser();
    return currentUser && currentUser.isAdmin === true;
}

/**
 * Require admin privileges for an action
 * @param {string} actionName - Name of the action for error message
 * @returns {boolean} True if user is admin, false otherwise
 */
function requireAdmin(actionName = 'This action') {
    if (!isUserAdmin()) {
        console.warn(`Admin privileges required for: ${actionName}`);
        alert('❌ Admin privileges required!');
        return false;
    }
    return true;
}

/**
 * Update navigation to show user info and logout button
 * @param {Object} userData - User data object
 */
function updateNavigation(userData) {
    const nav = document.querySelector('nav');
    if (!nav) return;
    
    // Remove login/signup links if they exist
    const loginLink = nav.querySelector('a[href="index.html"]');
    const signupLink = nav.querySelector('a[href="signup.html"]');
    
    if (loginLink && loginLink.textContent === 'Login') {
        loginLink.remove();
    }
    if (signupLink && signupLink.textContent === 'Sign Up') {
        signupLink.remove();
    }
    
    // Add user info and logout button if not already there
    if (!nav.querySelector('.user-info')) {
        const userInfo = document.createElement('div');
        userInfo.className = 'user-info';
        const adminBadge = userData.isAdmin ? ' <span style="color: #ff1493; font-weight: bold;">[ADMIN]</span>' : '';
        userInfo.innerHTML = `
            <span class="username">${userData.username}${adminBadge}</span>
            <a href="#" onclick="logoutUser(); return false;" class="logout-btn">Logout</a>
        `;
        nav.appendChild(userInfo);
    }
}

// Check for remembered user on page load
window.addEventListener('load', () => {
    const rememberedUser = localStorage.getItem('pixellumoRemember');
    const currentUser = getCurrentUser();
    
    if (currentUser && !document.body.className.includes('auth-page') && 
        !window.location.pathname.includes('login') && 
        !window.location.pathname.includes('signup')) {
        updateNavigation(currentUser);
    }
});
