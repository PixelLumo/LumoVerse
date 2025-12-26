// Backend API configuration
const API_URL = 'http://localhost:5000';
let allPosts = [];
let filteredPosts = [];

document.addEventListener('DOMContentLoaded', () => {
    const postForm = document.getElementById('postForm');
    const postsContainer = document.getElementById('postsContainer');
    const searchInput = document.getElementById('searchInput');
    const user = getCurrentUser();
    
    const ACH = {
        'Rookie Gamer': '🎮', 'Contributor': '📝', 'Chatter': '💬',
        'Community Builder': '🏗️', 'Popular Gamer': '⭐'
    };

    // Convert plain text URLs to clickable links
    const linkify = (text) => {
        if (!text) return '';
        return text.replace(
            /(https?:\/\/[^\s<>"{}|\\^`\[\]]+)/g,
            '<a href="$1" target="_blank" style="color: #ff1493; text-decoration: underline;">$1</a>'
        );
    };

    const checkAch = async (usr) => {
        if (!usr) return;
        
        const uPosts = allPosts.filter(p => p.username === usr.username).length;
        const uComm = allPosts.reduce((s, p) => s + (p.comments?.filter(c => c.username === usr.username).length || 0), 0);
        const uLikes = allPosts.filter(p => p.username === usr.username).reduce((s, p) => s + (p.likes || 0), 0);
        
        const ach = usr.achievements || [];
        const checks = [
            [uPosts >= 1, 'Rookie Gamer'],
            [uPosts >= 5, 'Contributor'],
            [uComm >= 1, 'Chatter'],
            [uComm >= 10, 'Community Builder'],
            [uLikes >= 50, 'Popular Gamer']
        ];
        
        let updated = false;
        checks.forEach(([cond, name]) => {
            if(cond && !ach.includes(name)) {
                ach.push(name);
                updated = true;
                alert(`${ACH[name]} Achievement: ${name}!`);
            }
        });
        
        if(updated) {
            usr.achievements = ach;
            sessionStorage.setItem('pixellumoUser', JSON.stringify(usr));
            try {
                await fetch(`${API_URL}/users/${usr.username}/achievements`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ achievements: ach })
                });
            } catch (e) {
                console.warn('Could not save achievements to server:', e);
            }
        }
    };

    // Load posts from backend
    const loadPosts = async () => {
        try {
            const res = await fetch(`${API_URL}/posts`);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            
            allPosts = await res.json();
            render();
        } catch (err) {
            console.error('Error loading posts:', err);
            postsContainer.innerHTML = '<p style="color: #ff1493;">⚠️ Backend server not running. Start it with: npm start</p>';
        }
    };

    const render = (filtered = null) => {
        let posts = filtered || allPosts;
        
        postsContainer.innerHTML = posts.length ? posts.map((p, i) => `
            <div class="section fade-in">
                <div style="display: flex; justify-content: space-between; align-items: start;">
                    <h3 style="display:inline; flex:1;">${p.title}${p.supporter ? UI.supporterBadge : ''}</h3>
                    ${user && user.role === 'admin' ? `<button onclick="deletePost(${p.id})" style="background: #ff4444; color: white; padding: 5px 10px; border: none; border-radius: 5px; cursor: pointer; font-size: 12px;">🗑️ Delete</button>` : ''}
                </div>
                <p>${linkify(p.content)}</p>
                ${p.image ? `<img src="${p.image}" alt="Post" style="max-width:100%;border-radius:10px;margin-top:10px;">` : ''}
                <small>By <strong>${p.username}</strong> on ${new Date(p.timestamp).toLocaleString()}</small>
                <div style="margin-top:10px;">
                    <button class="like-btn" data-id="${p.id}">👍 ${p.likes || 0}</button>
                </div>
                <div style="margin-top:15px;padding-top:15px;border-top:1px solid rgba(255,20,147,0.2);">
                    <h4>Comments (${(p.comments || []).length})</h4>
                    <div style="margin-bottom:10px;max-height:200px;overflow-y:auto;">
                        ${(p.comments || []).length ? p.comments.map(c => `
                            <div style="margin:8px 0; padding: 8px; background: rgba(255,20,147,0.05); border-radius: 5px;">
                                <strong>${c.username}</strong>${c.supporter ? '★' : ''}: ${linkify(c.text)}
                                ${user && user.role === 'admin' ? `<button onclick="deleteComment(${c.id})" style="margin-left: 10px; color: #ff4444; cursor: pointer; font-size: 12px; border: none; background: none;">✕</button>` : ''}
                            </div>
                        `).join('') : '<p style="color:#888;font-size:14px;">No comments yet</p>'}
                    </div>
                    ${user ? `
                        <input type="text" class="comment-in" placeholder="Comment..." data-id="${p.id}" style="width:80%;padding:10px;border-radius:5px;border:1px solid #ff1493;">
                        <button class="comment-btn" data-id="${p.id}" style="margin-left: 5px; padding: 10px 15px; background: #ff1493; color: white; border: none; border-radius: 5px; cursor: pointer;">Post</button>
                    ` : '<p style="color: #888; font-size: 12px;"><a href="login.html">Login</a> to comment</p>'}
                </div>
            </div>
        `).join('') : '<p>📭 No posts yet. Be the first to share!</p>';

        // Like button handlers
        document.querySelectorAll('.like-btn').forEach(b => {
            b.onclick = async (e) => {
                e.preventDefault();
                const postId = parseInt(b.dataset.id);
                try {
                    const res = await fetch(`${API_URL}/posts/${postId}/like`, { method: 'PATCH' });
                    if (res.ok) {
                        await loadPosts();
                        if(user) await checkAch(user);
                    }
                } catch (err) {
                    console.error('Error liking post:', err);
                }
            };
        });

        // Comment button handlers
        document.querySelectorAll('.comment-btn').forEach(b => {
            b.onclick = async (e) => {
                e.preventDefault();
                if(!user) { alert('Login to comment'); return; }
                
                const postId = parseInt(b.dataset.id);
                const txt = document.querySelector(`.comment-in[data-id="${postId}"]`).value.trim();
                
                if(txt) {
                    try {
                        const res = await fetch(`${API_URL}/posts/${postId}/comments`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                username: user.username,
                                text: txt,
                                supporter: user.supporter || false
                            })
                        });
                        
                        if (res.ok) {
                            document.querySelector(`.comment-in[data-id="${postId}"]`).value = '';
                            await loadPosts();
                            if(user) await checkAch(user);
                        }
                    } catch (err) {
                        console.error('Error posting comment:', err);
                        alert('Could not post comment');
                    }
                }
            };
        });
    };

    // Delete post (admin only)
    window.deletePost = async (postId) => {
        if (!user || user.role !== 'admin') {
            alert('Admin access required');
            return;
        }
        
        if (confirm('Delete this post permanently?')) {
            try {
                const res = await fetch(`${API_URL}/posts/${postId}`, { method: 'DELETE' });
                if (res.ok) {
                    await loadPosts();
                }
            } catch (err) {
                console.error('Error deleting post:', err);
                alert('Could not delete post');
            }
        }
    };

    // Delete comment (admin only)
    window.deleteComment = async (commentId) => {
        if (!user || user.role !== 'admin') {
            alert('Admin access required');
            return;
        }
        
        if (confirm('Delete this comment?')) {
            try {
                const res = await fetch(`${API_URL}/comments/${commentId}`, { method: 'DELETE' });
                if (res.ok) {
                    await loadPosts();
                }
            } catch (err) {
                console.error('Error deleting comment:', err);
                alert('Could not delete comment');
            }
        }
    };

    // Submit new post
    postForm.addEventListener('submit', async e => {
        e.preventDefault();
        if(!user) { alert('Login'); window.location='login.html'; return; }
        
        const title = document.getElementById('postTitle').value.trim();
        const content = document.getElementById('postContent').value.trim();
        const imgFile = document.getElementById('postImage').files[0];
        
        if(!title || !content) return;
        
        try {
            let imageData = null;
            if(imgFile) {
                imageData = await new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.onload = () => resolve(reader.result);
                    reader.readAsDataURL(imgFile);
                });
            }
            
            const res = await fetch(`${API_URL}/posts`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title,
                    content,
                    username: user.username,
                    image: imageData,
                    supporter: user.supporter || false,
                    isAdmin: user.role === 'admin'
                })
            });
            
            if (res.ok) {
                await loadPosts();
                await checkAch(user);
                postForm.reset();
            } else {
                alert('Error creating post');
            }
        } catch (err) {
            console.error('Error creating post:', err);
            alert('Could not create post');
        }
    });

    // Search functionality
    searchInput.addEventListener('input', () => {
        const q = searchInput.value.toLowerCase();
        filteredPosts = allPosts.filter(p => 
            p.title.toLowerCase().includes(q) || 
            p.content.toLowerCase().includes(q) || 
            p.username.toLowerCase().includes(q)
        );
        render(filteredPosts);
    });

    // Initial load and auto-refresh
    loadPosts();
    setInterval(loadPosts, 3000); // Refresh every 3 seconds for real-time feel
});
