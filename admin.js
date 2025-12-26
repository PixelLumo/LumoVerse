/**
 * Admin Dashboard System
 * Handles admin panel functionality, user management, content moderation
 */

const API_URL = getAPIUrl();
let currentUser = null;
let allUsers = [];
let allPosts = [];
let allComments = [];
let selectedUserId = null;
let currentDeleteTarget = null;

/**
 * Initialize admin dashboard
 */
document.addEventListener('DOMContentLoaded', async () => {
    // Check authentication
    currentUser = getCurrentUser();
    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }

    // Check admin status
    try {
        const response = await fetch(`${API_URL}/api/admin/check`, {
            headers: { 'Authorization': `Bearer ${getToken()}` }
        });
        const data = await response.json();

        if (!data.isAdmin) {
            document.getElementById('admin-content').style.display = 'none';
            document.getElementById('no-access').style.display = 'block';
            return;
        }

        // Load admin content
        document.getElementById('admin-content').style.display = 'block';
        document.getElementById('no-access').style.display = 'none';

        // Initialize dashboard
        await loadDashboard();
        
    } catch (error) {
        console.error('Error checking admin status:', error);
        showNotification('Error checking admin status', 'error');
    }
});

/**
 * Load dashboard statistics
 */
async function loadDashboard() {
    try {
        const response = await fetch(`${API_URL}/api/admin/dashboard`, {
            headers: { 'Authorization': `Bearer ${getToken()}` }
        });
        const data = await response.json();

        document.getElementById('stat-users').textContent = data.totalUsers;
        document.getElementById('stat-posts').textContent = data.totalPosts;
        document.getElementById('stat-comments').textContent = data.totalComments;
        document.getElementById('stat-admins').textContent = data.adminCount;
        document.getElementById('last-update').textContent = new Date(data.timestamp).toLocaleString();

        // Load initial data
        await Promise.all([
            loadUsers(),
            loadPosts(),
            loadComments()
        ]);
    } catch (error) {
        console.error('Error loading dashboard:', error);
        showNotification('Error loading dashboard', 'error');
    }
}

/**
 * Load all users
 */
async function loadUsers() {
    try {
        const searchTerm = document.getElementById('user-search')?.value || '';
        const response = await fetch(`${API_URL}/api/admin/users`, {
            headers: { 'Authorization': `Bearer ${getToken()}` }
        });
        const users = await response.json();
        allUsers = users;

        // Filter by search term
        let filtered = users;
        if (searchTerm) {
            filtered = users.filter(u => 
                u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                u.email.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        displayUsersTable(filtered);
    } catch (error) {
        console.error('Error loading users:', error);
        document.getElementById('users-list').innerHTML = '<div class="empty-state">Error loading users</div>';
        showNotification('Error loading users', 'error');
    }
}

/**
 * Display users in table format
 */
function displayUsersTable(users) {
    const container = document.getElementById('users-list');

    if (!users || users.length === 0) {
        container.innerHTML = '<div class="empty-state"><div class="icon">👥</div>No users found</div>';
        return;
    }

    let html = `
        <table class="data-table">
            <thead>
                <tr>
                    <th>User</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Posts</th>
                    <th>Followers</th>
                    <th>Joined</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
    `;

    users.forEach(user => {
        const joinDate = new Date(user.created_at).toLocaleDateString();
        html += `
            <tr>
                <td>
                    <div class="user-cell">
                        <div class="user-avatar">${user.username.substring(0, 2).toUpperCase()}</div>
                        <span>${escapeHtml(user.username)}</span>
                    </div>
                </td>
                <td>${escapeHtml(user.email)}</td>
                <td><span class="role-badge ${user.role}">${user.role.toUpperCase()}</span></td>
                <td>${user.post_count || 0}</td>
                <td>${user.follower_count || 0}</td>
                <td>${joinDate}</td>
                <td>
                    <div class="action-buttons">
                        <button class="action-btn edit" onclick="editUser(${user.id})">Edit</button>
                    </div>
                </td>
            </tr>
        `;
    });

    html += `
            </tbody>
        </table>
    `;

    container.innerHTML = html;
}

/**
 * Load all posts
 */
async function loadPosts() {
    try {
        const searchTerm = document.getElementById('post-search')?.value || '';
        const response = await fetch(`${API_URL}/api/admin/posts`, {
            headers: { 'Authorization': `Bearer ${getToken()}` }
        });
        const posts = await response.json();
        allPosts = posts;

        // Filter by search term
        let filtered = posts;
        if (searchTerm) {
            filtered = posts.filter(p => 
                p.title.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        displayPostsTable(filtered);
    } catch (error) {
        console.error('Error loading posts:', error);
        document.getElementById('posts-list').innerHTML = '<div class="empty-state">Error loading posts</div>';
    }
}

/**
 * Display posts in table format
 */
function displayPostsTable(posts) {
    const container = document.getElementById('posts-list');

    if (!posts || posts.length === 0) {
        container.innerHTML = '<div class="empty-state"><div class="icon">📝</div>No posts found</div>';
        return;
    }

    let html = `
        <table class="data-table">
            <thead>
                <tr>
                    <th>Title</th>
                    <th>Author</th>
                    <th>Comments</th>
                    <th>Likes</th>
                    <th>Created</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
    `;

    posts.forEach(post => {
        const createdDate = new Date(post.created_at).toLocaleDateString();
        const title = escapeHtml(post.title).length > 50 
            ? escapeHtml(post.title).substring(0, 50) + '...' 
            : escapeHtml(post.title);
        
        html += `
            <tr>
                <td title="${escapeHtml(post.title)}">${title}</td>
                <td>${escapeHtml(post.username)}</td>
                <td>${post.comment_count || 0}</td>
                <td>${post.like_count || 0}</td>
                <td>${createdDate}</td>
                <td>
                    <div class="action-buttons">
                        <button class="action-btn edit" onclick="viewPost(${post.id})">View</button>
                        <button class="action-btn delete" onclick="deletePost(${post.id})">Delete</button>
                    </div>
                </td>
            </tr>
        `;
    });

    html += `
            </tbody>
        </table>
    `;

    container.innerHTML = html;
}

/**
 * Load all comments
 */
async function loadComments() {
    try {
        const searchTerm = document.getElementById('comment-search')?.value || '';
        const response = await fetch(`${API_URL}/api/admin/comments`, {
            headers: { 'Authorization': `Bearer ${getToken()}` }
        });
        const comments = await response.json();
        allComments = comments;

        // Filter by search term
        let filtered = comments;
        if (searchTerm) {
            filtered = comments.filter(c => 
                c.content.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        displayCommentsTable(filtered);
    } catch (error) {
        console.error('Error loading comments:', error);
        document.getElementById('comments-list').innerHTML = '<div class="empty-state">Error loading comments</div>';
    }
}

/**
 * Display comments in table format
 */
function displayCommentsTable(comments) {
    const container = document.getElementById('comments-list');

    if (!comments || comments.length === 0) {
        container.innerHTML = '<div class="empty-state"><div class="icon">💬</div>No comments found</div>';
        return;
    }

    let html = `
        <table class="data-table">
            <thead>
                <tr>
                    <th>Content</th>
                    <th>Author</th>
                    <th>Post</th>
                    <th>Created</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
    `;

    comments.forEach(comment => {
        const createdDate = new Date(comment.created_at).toLocaleDateString();
        const content = escapeHtml(comment.content).length > 60 
            ? escapeHtml(comment.content).substring(0, 60) + '...' 
            : escapeHtml(comment.content);
        const postTitle = comment.post_title ? escapeHtml(comment.post_title).substring(0, 40) : 'Unknown Post';
        
        html += `
            <tr>
                <td title="${escapeHtml(comment.content)}">${content}</td>
                <td>${escapeHtml(comment.username)}</td>
                <td title="${escapeHtml(comment.post_title)}">${postTitle}</td>
                <td>${createdDate}</td>
                <td>
                    <div class="action-buttons">
                        <button class="action-btn delete" onclick="deleteComment(${comment.id})">Delete</button>
                    </div>
                </td>
            </tr>
        `;
    });

    html += `
            </tbody>
        </table>
    `;

    container.innerHTML = html;
}

/**
 * Switch between tabs
 */
function switchTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });

    // Deactivate all buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // Show selected tab
    document.getElementById(`${tabName}-tab`).classList.add('active');
    event.target.classList.add('active');
}

/**
 * Edit user
 */
async function editUser(userId) {
    try {
        const response = await fetch(`${API_URL}/api/admin/users/${userId}`, {
            headers: { 'Authorization': `Bearer ${getToken()}` }
        });
        const user = await response.json();

        selectedUserId = userId;
        document.getElementById('edit-user-id').value = userId;
        document.getElementById('edit-user-username').value = user.username;
        document.getElementById('edit-user-email').value = user.email;
        document.getElementById('edit-user-role').value = user.role;

        openModal('edit-user-modal');
    } catch (error) {
        console.error('Error loading user:', error);
        showNotification('Error loading user details', 'error');
    }
}

/**
 * Save user changes
 */
document.getElementById('edit-user-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const userId = document.getElementById('edit-user-id').value;
    const newRole = document.getElementById('edit-user-role').value;

    try {
        const response = await fetch(`${API_URL}/api/admin/users/${userId}/role`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${getToken()}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ role: newRole })
        });

        const data = await response.json();
        
        if (response.ok) {
            showNotification('User role updated successfully', 'success');
            closeModal('edit-user-modal');
            await loadDashboard();
        } else {
            showNotification(data.error || 'Error updating user', 'error');
        }
    } catch (error) {
        console.error('Error updating user:', error);
        showNotification('Error updating user', 'error');
    }
});

/**
 * Delete user confirmation
 */
function deleteUserConfirm() {
    const username = document.getElementById('edit-user-username').value;
    currentDeleteTarget = selectedUserId;
    document.getElementById('delete-confirm-text').textContent = `Are you sure you want to delete user "${username}"? This action cannot be undone.`;
    closeModal('edit-user-modal');
    openModal('delete-confirm-modal');
}

/**
 * Confirm delete
 */
async function confirmDelete() {
    try {
        const response = await fetch(`${API_URL}/api/admin/users/${currentDeleteTarget}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${getToken()}` }
        });

        const data = await response.json();
        
        if (response.ok) {
            showNotification('User deleted successfully', 'success');
            closeModal('delete-confirm-modal');
            await loadDashboard();
        } else {
            showNotification(data.error || 'Error deleting user', 'error');
        }
    } catch (error) {
        console.error('Error deleting user:', error);
        showNotification('Error deleting user', 'error');
    }
}

/**
 * Delete post
 */
async function deletePost(postId) {
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
        const response = await fetch(`${API_URL}/api/admin/posts/${postId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${getToken()}` }
        });

        const data = await response.json();
        
        if (response.ok) {
            showNotification('Post deleted successfully', 'success');
            await loadPosts();
        } else {
            showNotification(data.error || 'Error deleting post', 'error');
        }
    } catch (error) {
        console.error('Error deleting post:', error);
        showNotification('Error deleting post', 'error');
    }
}

/**
 * View post details
 */
function viewPost(postId) {
    const post = allPosts.find(p => p.id === postId);
    if (post) {
        window.open(`home.html#post-${postId}`, '_blank');
    }
}

/**
 * Delete comment
 */
async function deleteComment(commentId) {
    if (!confirm('Are you sure you want to delete this comment?')) return;

    try {
        const response = await fetch(`${API_URL}/api/admin/comments/${commentId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${getToken()}` }
        });

        const data = await response.json();
        
        if (response.ok) {
            showNotification('Comment deleted successfully', 'success');
            await loadComments();
        } else {
            showNotification(data.error || 'Error deleting comment', 'error');
        }
    } catch (error) {
        console.error('Error deleting comment:', error);
        showNotification('Error deleting comment', 'error');
    }
}

/**
 * Search users
 */
function searchUsers() {
    const searchTerm = document.getElementById('user-search').value;
    const filtered = allUsers.filter(u => 
        u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    displayUsersTable(filtered);
}

/**
 * Search posts
 */
function searchPosts() {
    const searchTerm = document.getElementById('post-search').value;
    const filtered = allPosts.filter(p => 
        p.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    displayPostsTable(filtered);
}

/**
 * Search comments
 */
function searchComments() {
    const searchTerm = document.getElementById('comment-search').value;
    const filtered = allComments.filter(c => 
        c.content.toLowerCase().includes(searchTerm.toLowerCase())
    );
    displayCommentsTable(filtered);
}

/**
 * Refresh dashboard
 */
async function refreshDashboard() {
    showNotification('Refreshing dashboard...', 'success');
    await loadDashboard();
    showNotification('Dashboard refreshed', 'success');
}

/**
 * Export data (placeholder)
 */
function exportData() {
    showNotification('Export feature coming soon', 'success');
}

/**
 * Show add user modal
 */
function showAddUserModal() {
    showNotification('Add user feature coming soon', 'success');
}

/**
 * Open modal
 */
function openModal(modalId) {
    document.getElementById(modalId).classList.add('active');
}

/**
 * Close modal
 */
function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

/**
 * Show notification
 */
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

/**
 * Escape HTML special characters
 */
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Get current user from localStorage
 */
function getCurrentUser() {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
}

/**
 * Get auth token
 */
function getToken() {
    return localStorage.getItem('authToken');
}

/**
 * Get API URL
 */
function getAPIUrl() {
    return window.location.origin;
}
