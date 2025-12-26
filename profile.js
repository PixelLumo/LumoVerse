/**
 * PixelLumo User Profile System
 * Handles user profile display, follow/unfollow, and user posts
 */

let currentProfile = null;
let currentUser = null;

document.addEventListener('DOMContentLoaded', () => {
    // Get logged-in user
    currentUser = getCurrentUser();

    // Get username from URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const username = urlParams.get('u') || urlParams.get('user');

    if (!username) {
        showError('No user specified. Please use profile.html?u=username');
        return;
    }

    loadProfile(username);
});

/**
 * Load user profile from localStorage
 */
function loadProfile(username) {
    try {
        // Load profile data from localStorage
        const profileData = localStorage.getItem(`userProfile_${username}`);
        const userData = localStorage.getItem(`user_${username}`);
        const achievementsData = localStorage.getItem(`userAchievements_${username}`);
        
        if (!profileData && !userData) {
            showError(`User "${username}" not found`);
            return;
        }

        // Build profile object from available data
        const profile = profileData ? JSON.parse(profileData) : {};
        const user = userData ? JSON.parse(userData) : {};
        const achievements = achievementsData ? JSON.parse(achievementsData) : [];

        currentProfile = {
            username: username,
            email: user.email || 'hidden',
            bio: profile.bio || 'No bio yet',
            favGame: profile.favGame || 'Not specified',
            avatar: profile.avatar || null,
            joinDate: user.loginTime || new Date().toISOString(),
            followers: profile.followers || 0,
            following: profile.following || 0,
            role: user.isAdmin ? 'admin' : 'user',
            achievements: achievements
        };

        // Check privacy settings
        const settingsData = localStorage.getItem(`userSettings_${username}`);
        const settings = settingsData ? JSON.parse(settingsData) : {};
        const isOwnProfile = currentUser && currentUser.username === username;

        // If profile is private and not viewing own profile, show limited info
        if (!settings.publicProfile && !isOwnProfile) {
            showError(`${username}'s profile is private`);
            return;
        }

        displayProfile();
        loadUserPosts(username);
    } catch (error) {
        console.error('Error loading profile:', error);
        showError('Error loading profile: ' + error.message);
    }
}

/**
 * Display profile header with stats and follow button
 */
function displayProfile() {
    const headerDiv = document.getElementById('profile-header');
    const contentDiv = document.getElementById('profile-content');

    const isOwnProfile = currentUser && currentUser.username === currentProfile.username;
    const roleIcon = currentProfile.role === 'admin' ? '👑 ' : '';
    const joinDateFormatted = new Date(currentProfile.joinDate).toLocaleDateString();

    let actionButtons = '';
    if (isOwnProfile) {
        actionButtons = `<a href="settings.html" class="btn btn-secondary">Edit Profile</a>`;
    } else if (currentUser) {
        actionButtons = `
            <button id="follow-btn" class="btn btn-primary" onclick="toggleFollow()">
                Follow
            </button>
        `;
    } else {
        actionButtons = '<p style="color: #999; margin-top: 10px;"><a href="../../index.html">Login to follow</a></p>';
    }

    headerDiv.innerHTML = `
        <div class="profile-avatar">
            ${currentProfile.avatar ? `<img src="${currentProfile.avatar}" alt="${currentProfile.username}">` : '👤'}
        </div>
        <div class="profile-name">${roleIcon}${currentProfile.username}</div>
        ${currentProfile.role === 'admin' ? '<div class="profile-role admin">🏆 Admin</div>' : ''}
        ${currentProfile.bio ? `<div class="profile-bio">"${currentProfile.bio}"</div>` : ''}
        ${currentProfile.favGame && currentProfile.favGame !== 'Not specified' ? `<div class="profile-info">🎮 Favorite Game: ${escapeHtml(currentProfile.favGame)}</div>` : ''}
        <div class="profile-info" style="font-size: 13px; color: #aaa; margin-top: 10px;">Joined ${joinDateFormatted}</div>
        <div class="profile-stats">
            <div class="stat">
                <div class="stat-number">${currentProfile.followers || 0}</div>
                <div class="stat-label">Followers</div>
            </div>
            <div class="stat">
                <div class="stat-number">${currentProfile.following || 0}</div>
                <div class="stat-label">Following</div>
            </div>
            <div class="stat">
                <div class="stat-number">${currentProfile.achievements ? currentProfile.achievements.length : 0}</div>
                <div class="stat-label">Achievements</div>
            </div>
        </div>
        <div class="profile-actions">
            ${actionButtons}
        </div>
    `;

    headerDiv.classList.remove('loading');
    contentDiv.style.display = 'block';

    // Check follow status if not own profile
    if (!isOwnProfile && currentUser) {
        checkFollowStatus(currentProfile.username);
    }
}

/**
 * Load and display user's posts (demo - from localStorage)
 */
function loadUserPosts(username) {
    try {
        // For now, show placeholder - posts would be stored with user data
        const postsData = localStorage.getItem(`userPosts_${username}`);
        const posts = postsData ? JSON.parse(postsData) : [];
        const postsList = document.getElementById('posts-list');

        if (!posts || posts.length === 0) {
            postsList.innerHTML = '<div class="empty">No posts yet</div>';
            return;
        }

        postsList.innerHTML = posts.map(post => `
            <div class="post-card">
                <div class="post-title">${escapeHtml(post.title)}</div>
                <div class="post-excerpt">${escapeHtml(post.content.substring(0, 150))}${post.content.length > 150 ? '...' : ''}</div>
                <div class="post-date">${formatDate(post.created_at)}</div>
                <button class="btn btn-primary" style="margin-top: 10px;" onclick="viewPost('${post.id}')">Read More</button>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading posts:', error);
    }
}

/**
 * Check if current user is following this profile
 */
function checkFollowStatus(username) {
    if (!currentUser) return;

    try {
        const followingList = localStorage.getItem(`userFollowing_${currentUser.username}`);
        const following = followingList ? JSON.parse(followingList) : [];
        
        const isFollowing = following.includes(username);
        const btn = document.getElementById('follow-btn');
        
        if (btn) {
            if (isFollowing) {
                btn.textContent = 'Unfollow';
                btn.classList.remove('btn-primary');
                btn.classList.add('btn-danger');
            } else {
                btn.textContent = 'Follow';
                btn.classList.add('btn-primary');
                btn.classList.remove('btn-danger');
            }
        }
    } catch (error) {
        console.error('Error checking follow status:', error);
    }
}

/**
 * Toggle follow/unfollow
 */
function toggleFollow() {
    if (!currentUser) {
        alert('Please login to follow users');
        return;
    }

    const btn = document.getElementById('follow-btn');
    const isFollowing = btn.textContent === 'Unfollow';
    const targetUsername = currentProfile.username;

    try {
        // Get current following list
        const followingList = localStorage.getItem(`userFollowing_${currentUser.username}`);
        let following = followingList ? JSON.parse(followingList) : [];

        if (isFollowing) {
            // Unfollow
            following = following.filter(u => u !== targetUsername);
            btn.textContent = 'Follow';
            btn.classList.add('btn-primary');
            btn.classList.remove('btn-danger');
            currentProfile.followers = Math.max(0, (currentProfile.followers || 1) - 1);
        } else {
            // Follow
            if (!following.includes(targetUsername)) {
                following.push(targetUsername);
            }
            btn.textContent = 'Unfollow';
            btn.classList.remove('btn-primary');
            btn.classList.add('btn-danger');
            currentProfile.followers = (currentProfile.followers || 0) + 1;
        }

        // Save updated following list
        localStorage.setItem(`userFollowing_${currentUser.username}`, JSON.stringify(following));

        // Update follower count in UI
        const followerStat = Array.from(document.querySelectorAll('.stat')).find(s => 
            s.querySelector('.stat-label').textContent === 'Followers'
        );
        if (followerStat) {
            followerStat.querySelector('.stat-number').textContent = currentProfile.followers;
        }
    } catch (error) {
        console.error('Error toggling follow:', error);
        alert('Error: ' + error.message);
    }
}

/**
 * Edit own profile - redirect to settings
 */
function editProfile() {
    window.location.href = 'settings.html';
}

/**
 * View full post
 */
function viewPost(postId) {
    // Redirect to blog page with post ID or open post detail view
    window.location.href = `blog.html?id=${postId}`;
}

/**
 * Format date to readable format
 */
function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString();
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Show error message
 */
function showError(message) {
    const headerDiv = document.getElementById('profile-header');
    const errorDiv = document.getElementById('error-message');
    
    headerDiv.innerHTML = '';
    errorDiv.innerHTML = `<div class="error">${message}</div>`;
}
