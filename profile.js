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
    let username = urlParams.get('u') || urlParams.get('user');

    // If no username in URL, show current user's profile if logged in
    if (!username && currentUser && currentUser.username) {
        username = currentUser.username;
    }

    if (!username) {
        showError('No user specified and not logged in. Please use profile.html?u=username or log in.');
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
        let profileData = localStorage.getItem(`userProfile_${username}`);
        let userData = localStorage.getItem(`user_${username}`);
        let achievementsData = localStorage.getItem(`userAchievements_${username}`);

        // If not found locally, try to fetch from backend
        if (!profileData || !userData) {
            fetch(`${window.API_BASE}/api/profile/${username}`)
                .then(r => r.ok ? r.json() : null)
                .then(user => {
                    if (!user) {
                        showError(`User "${username}" not found`);
                        return;
                    }
                    // Save to localStorage for next time
                    localStorage.setItem(`user_${username}`, JSON.stringify(user));
                    // Optionally fetch profile/achievements if you have endpoints
                    // For now, just use user object
                    currentProfile = {
                        username: user.username,
                        email: user.email || 'hidden',
                        bio: user.bio || 'No bio yet',
                        favGame: user.favGame || 'Not specified',
                        avatar: user.avatar || null,
                        joinDate: user.created_at || new Date().toISOString(),
                        followers: user.followers || 0,
                        following: user.following || 0,
                        role: user.role || 'user',
                        achievements: []
                    };
                    displayProfile();
                    loadUserPosts(username);
                })
                .catch(() => showError(`User "${username}" not found`));
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
    const fieldsDiv = document.getElementById('profile-fields');

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

    // Profile fields with N/A fallback
    const profileFields = [
        { label: 'Username', value: currentProfile.username || 'N/A' },
        { label: 'Email', value: currentProfile.email || 'N/A' },
        { label: 'Bio', value: currentProfile.bio || 'N/A' },
        { label: 'Favorite Game', value: currentProfile.favGame || 'N/A' },
        { label: 'Role', value: currentProfile.role || 'N/A' },
        { label: 'Joined', value: joinDateFormatted || 'N/A' },
        { label: 'Followers', value: currentProfile.followers != null ? currentProfile.followers : 'N/A' },
        { label: 'Following', value: currentProfile.following != null ? currentProfile.following : 'N/A' },
        { label: 'Achievements', value: currentProfile.achievements && currentProfile.achievements.length ? currentProfile.achievements.length : 'N/A' }
    ];

    fieldsDiv.innerHTML = `
        <div class="profile-fields-list">
            ${profileFields.map(f => `<div class="profile-field"><strong>${f.label}:</strong> <span>${escapeHtml(String(f.value))}</span></div>`).join('')}
        </div>
        ${isOwnProfile ? `<div class="profile-messages-opt" style="margin: 20px 0;">
            <label style="font-weight: bold;">Allow Private Messages:</label>
            <button id="allowMessagesProfile" class="toggle-switch">Loading...</button>
            <span id="allowMessagesStatus" style="margin-left: 10px; color: #888;"></span>
        </div>` : ''}
    `;

    headerDiv.innerHTML = `
        <div class="profile-avatar">
            ${currentProfile.avatar ? `<img src="${currentProfile.avatar}" alt="${currentProfile.username}">` : '👤'}
        </div>
        <div class="profile-name">${roleIcon}${currentProfile.username}</div>
        ${currentProfile.role === 'admin' ? '<div class="profile-role admin">🏆 Admin</div>' : ''}
        <div class="profile-actions">${actionButtons}</div>
    `;

    headerDiv.classList.remove('loading');
    contentDiv.style.display = 'block';

    // Check follow status if not own profile
    if (!isOwnProfile && currentUser) {
        checkFollowStatus(currentProfile.username);
    }

    // Setup allow messages toggle if own profile
    if (isOwnProfile) {
        setupAllowMessagesToggle();
    }
}

// Add this function to handle the allow messages toggle
function setupAllowMessagesToggle() {
    const btn = document.getElementById('allowMessagesProfile');
    const status = document.getElementById('allowMessagesStatus');
    const currentUser = getCurrentUser();
    if (!btn || !currentUser) return;
    // Load from settings
    const settingsKey = 'userSettings_' + currentUser.username;
    const settings = JSON.parse(localStorage.getItem(settingsKey)) || {};
    const allowed = settings.allowMessages !== false;
    btn.classList.toggle('active', allowed);
    btn.textContent = allowed ? 'ON' : 'OFF';
    status.textContent = allowed ? 'Others can message you' : 'Messages disabled';
    btn.onclick = function() {
        btn.classList.toggle('active');
        const newAllowed = btn.classList.contains('active');
        btn.textContent = newAllowed ? 'ON' : 'OFF';
        status.textContent = newAllowed ? 'Others can message you' : 'Messages disabled';
        // Save to settings
        settings.allowMessages = newAllowed;
        localStorage.setItem(settingsKey, JSON.stringify(settings));
    };
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
