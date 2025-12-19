/**
 * PixelLumo Authentication System
 * Handles user login/logout and session management
 */

// Check authentication on page load
document.addEventListener('DOMContentLoaded', () => {
    const isAuthPage = document.body.className.includes('auth-page') || 
                      window.location.pathname.includes('login') || 
                      window.location.pathname.includes('signup');
    
    // If not on auth page, check if user is logged in
    if (!isAuthPage) {
        const userSession = sessionStorage.getItem('pixellumoUser');
        if (!userSession) {
            // Redirect to login if not authenticated
            window.location.href = 'index.html';
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

/**
 * Handle user login
 * @param {string} email - User email
 * @param {string} username - User username
 * @param {boolean} remember - Remember me checkbox
 */
function loginUser(email, username, remember = false) {
    const usernameToUse = username || email.split('@')[0];
    const achievements = JSON.parse(localStorage.getItem('userAchievements_' + usernameToUse)) || [];
    
    const userData = {
        email: email,
        username: usernameToUse,
        loginTime: new Date().toISOString(),
        supporter: false, // Default to false, can be set to true by admin/manual override
        achievements: achievements
    };
    
    // Check if user is a supporter and unlock achievement
    if(userData.supporter && !achievements.includes('Patreon Hero')) {
        achievements.push('Patreon Hero');
        localStorage.setItem('userAchievements_' + usernameToUse, JSON.stringify(achievements));
        userData.achievements = achievements;
        setTimeout(() => {
            alert('🎉 Achievement Unlocked: Patreon Hero! Thank you for supporting PixelLumo!');
        }, 500);
    }
    
    // Store in sessionStorage (cleared when browser closes)
    sessionStorage.setItem('pixellumoUser', JSON.stringify(userData));
    
    // Store in localStorage if "remember me" is checked
    if (remember) {
        localStorage.setItem('pixellumoRemember', JSON.stringify(userData));
    }
    
    return userData;
}

/**
 * Handle user logout
 */
function logoutUser() {
    sessionStorage.removeItem('pixellumoUser');
    localStorage.removeItem('pixellumoRemember');
    window.location.href = 'index.html';
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
        userInfo.innerHTML = `
            <span class="username">${userData.username}</span>
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
