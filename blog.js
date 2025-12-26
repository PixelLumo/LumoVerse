document.addEventListener('DOMContentLoaded', async () => {
    let blogPosts = [];
    const blogContainer = document.getElementById('blogContainer');
    const blogSearch = document.getElementById('blogSearch');

    // Fetch posts from backend API
    async function loadPosts() {
        try {
            const response = await fetch(`${API_BASE}/api/posts`);
            if (!response.ok) throw new Error('Failed to load posts');
            
            const posts = await response.json();
            blogPosts = posts.map(p => ({
                id: p.id,
                title: p.title,
                content: p.content,
                time: new Date(p.created_at).getTime(),
                username: p.username,
                avatar: p.avatar,
                likes: p.likes_count || 0,
                file_path: p.file_path
            }));
            
            displayPosts();
        } catch (error) {
            console.error('Error loading posts:', error);
            blogContainer.innerHTML = '<p style="color: #ff4444;">Error loading blog posts</p>';
        }
    }

    function displayPosts(filtered = null) {
        blogContainer.innerHTML = '';
        const list = filtered || blogPosts;
        if(list.length === 0) { 
            blogContainer.innerHTML = '<p>No blog posts yet! Check back soon for updates and news.</p>'; 
            return; 
        }
        list.forEach(post => {
            const div = document.createElement('div');
            div.className = 'blog-post';
            const imageHTML = post.file_path ? `<img src="${post.file_path}" style="max-width:100%; margin-bottom:10px; border-radius:5px;">` : '';
            div.innerHTML = `
                <h3>${post.title}</h3>
                <p style="color:#999; font-size:12px;">by <strong>${post.username}</strong> • ${new Date(post.time).toLocaleDateString()}</p>
                ${imageHTML}
                <p>${post.content}</p>
                <div style="margin-top:10px; display:flex; gap:10px; align-items:center;">
                    <button onclick="likePost(${post.id})" style="background:#ff1493;border:none;color:white;padding:8px 15px;border-radius:5px;cursor:pointer;">❤️ Like (${post.likes})</button>
                </div>
            `;
            blogContainer.appendChild(div);
        });
    }

    window.likePost = async (postId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE}/api/posts/${postId}/like`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (response.ok) {
                await loadPosts(); // Refresh posts to show new like count
            }
        } catch (error) {
            console.error('Error liking post:', error);
        }
    };

    blogSearch.addEventListener('input', () => {
        const query = blogSearch.value.toLowerCase();
        const filtered = blogPosts.filter(p => 
            p.title.toLowerCase().includes(query) || 
            p.content.toLowerCase().includes(query)
        );
        displayPosts(filtered);
    });

    // Load posts on page load
    await loadPosts();
});
