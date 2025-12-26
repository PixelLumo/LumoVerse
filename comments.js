/**
 * PixelLumo Comments System
 * Handles comment creation, display, replies, and interactions
 */

// Make links clickable in comments
function autoLink(text) {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.replace(urlRegex, '<a href="$1" target="_blank">$1</a>');
}

// Load and display comments for a post
async function loadComments(postId) {
    try {
        const response = await fetch(`/api/posts/${postId}/comments`);
        if (!response.ok) throw new Error('Failed to load comments');
        
        const comments = await response.json();
        const commentsContainer = document.getElementById(`comments-${postId}`);
        
        if (!commentsContainer) return;
        
        commentsContainer.innerHTML = '';
        
        comments.forEach(comment => {
            const commentDiv = createCommentElement(comment, postId);
            commentsContainer.appendChild(commentDiv);
        });
    } catch (error) {
        console.error('Error loading comments:', error);
    }
}

// Create comment element with replies
function createCommentElement(comment, postId) {
    const div = document.createElement('div');
    div.className = 'comment';
    div.id = `comment-${comment.id}`;
    
    const currentUser = getCurrentUser();
    const isAuthor = currentUser && currentUser.id === comment.user_id;
    const isAdmin = currentUser && currentUser.role === 'admin';
    const canDelete = isAuthor || isAdmin;
    
    const roleIcon = comment.role === 'admin' ? '👑 ' : '';
    
    div.innerHTML = `
        <div class="comment-header">
            <strong>${roleIcon}${comment.username}</strong>
            <small>${formatDate(comment.created_at)}</small>
        </div>
        <div class="comment-content">
            ${autoLink(comment.content)}
        </div>
        <div class="comment-actions">
            <button class="reply-btn" onclick="toggleReplyForm(${comment.id})">Reply</button>
            ${canDelete ? `<button class="delete-btn" onclick="deleteComment(${comment.id}, ${postId})">Delete</button>` : ''}
        </div>
        <div id="replies-${comment.id}" class="replies-container"></div>
        <div id="reply-form-${comment.id}" class="reply-form hidden">
            <textarea id="reply-text-${comment.id}" placeholder="Write a reply..."></textarea>
            <button onclick="submitReply(${comment.id}, ${postId})">Send Reply</button>
            <button onclick="toggleReplyForm(${comment.id})">Cancel</button>
        </div>
    `;
    
    // Load replies for this comment
    loadReplies(comment.id, postId);
    
    return div;
}

// Load and display replies for a comment
async function loadReplies(commentId, postId) {
    try {
        const response = await fetch(`/api/comments/${commentId}/replies`);
        if (!response.ok) throw new Error('Failed to load replies');
        
        const replies = await response.json();
        const repliesContainer = document.getElementById(`replies-${commentId}`);
        
        if (!repliesContainer) return;
        
        repliesContainer.innerHTML = '';
        
        replies.forEach(reply => {
            const replyDiv = createReplyElement(reply, commentId, postId);
            repliesContainer.appendChild(replyDiv);
        });
    } catch (error) {
        console.error('Error loading replies:', error);
    }
}

// Create reply element
function createReplyElement(reply, commentId, postId) {
    const div = document.createElement('div');
    div.className = 'reply';
    div.id = `reply-${reply.id}`;
    
    const currentUser = getCurrentUser();
    const isAuthor = currentUser && currentUser.id === reply.user_id;
    const isAdmin = currentUser && currentUser.role === 'admin';
    const canDelete = isAuthor || isAdmin;
    
    const roleIcon = reply.role === 'admin' ? '👑 ' : '';
    
    div.innerHTML = `
        <div class="reply-header">
            <strong>${roleIcon}${reply.username}</strong>
            <small>${formatDate(reply.created_at)}</small>
        </div>
        <div class="reply-content">
            ${autoLink(reply.content)}
        </div>
        ${canDelete ? `<button class="delete-btn" onclick="deleteReply(${reply.id}, ${commentId}, ${postId})">Delete</button>` : ''}
    `;
    
    return div;
}

// Toggle reply form visibility
function toggleReplyForm(commentId) {
    const form = document.getElementById(`reply-form-${commentId}`);
    if (form) {
        form.classList.toggle('hidden');
    }
}

// Submit a new reply
async function submitReply(commentId, postId) {
    const textarea = document.getElementById(`reply-text-${commentId}`);
    const content = textarea.value.trim();
    
    if (!content) {
        alert('Reply cannot be empty');
        return;
    }
    
    try {
        const response = await fetch(`/api/comments/${commentId}/replies`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ content })
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to submit reply');
        }
        
        textarea.value = '';
        toggleReplyForm(commentId);
        loadReplies(commentId, postId);
    } catch (error) {
        console.error('Error submitting reply:', error);
        alert('Error: ' + error.message);
    }
}

// Delete a comment (admin/author only)
async function deleteComment(commentId, postId) {
    if (!confirm('Delete this comment?')) return;
    
    try {
        const response = await fetch(`/api/comments/${commentId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to delete comment');
        }
        
        // Remove comment from DOM
        const commentDiv = document.getElementById(`comment-${commentId}`);
        if (commentDiv) {
            commentDiv.remove();
        }
        
        loadComments(postId);
    } catch (error) {
        console.error('Error deleting comment:', error);
        alert('Error: ' + error.message);
    }
}

// Delete a reply (admin/author only)
async function deleteReply(replyId, commentId, postId) {
    if (!confirm('Delete this reply?')) return;
    
    try {
        const response = await fetch(`/api/replies/${replyId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to delete reply');
        }
        
        // Remove reply from DOM
        const replyDiv = document.getElementById(`reply-${replyId}`);
        if (replyDiv) {
            replyDiv.remove();
        }
        
        loadReplies(commentId, postId);
    } catch (error) {
        console.error('Error deleting reply:', error);
        alert('Error: ' + error.message);
    }
}

// Submit a new comment
async function submitComment(postId) {
    const textarea = document.getElementById(`comment-text-${postId}`);
    const content = textarea.value.trim();
    
    if (!content) {
        alert('Comment cannot be empty');
        return;
    }
    
    try {
        const response = await fetch(`/api/posts/${postId}/comments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ content })
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to submit comment');
        }
        
        textarea.value = '';
        loadComments(postId);
    } catch (error) {
        console.error('Error submitting comment:', error);
        alert('Error: ' + error.message);
    }
}

// Format date to readable format
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

// Get current logged-in user
function getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
}
