document.addEventListener('DOMContentLoaded', () => {
    const postForm = document.getElementById('postForm');
    const postsContainer = document.getElementById('postsContainer');
    const searchInput = document.getElementById('searchInput');
    const user = getCurrentUser();
    
    const ACH = {
        'Rookie Gamer': '🎮', 'Contributor': '📝', 'Chatter': '💬',
        'Community Builder': '🏗️', 'Popular Gamer': '⭐'
    };

    const checkAch = (usr) => {
        const posts = Store.posts();
        const uPosts = posts.filter(p => p.username === usr.username).length;
        const uComm = posts.reduce((s, p) => s + (p.comments?.filter(c => c.username === usr.username).length || 0), 0);
        const uLikes = posts.filter(p => p.username === usr.username).reduce((s, p) => s + (p.likes || 0), 0);
        
        const ach = usr.achievements || [];
        const checks = [
            [uPosts >= 1, 'Rookie Gamer'],
            [uPosts >= 5, 'Contributor'],
            [uComm >= 1, 'Chatter'],
            [uComm >= 10, 'Community Builder'],
            [uLikes >= 50, 'Popular Gamer']
        ];
        
        checks.forEach(([cond, name]) => {
            if(cond && !ach.includes(name)) {
                ach.push(name);
                alert(`${ACH[name]} Achievement: ${name}!`);
            }
        });
        
        if(ach.length > (usr.achievements?.length || 0)) {
            usr.achievements = ach;
            sessionStorage.setItem('pixellumoUser', JSON.stringify(usr));
            localStorage.setItem(`userAchievements_${usr.username}`, JSON.stringify(ach));
        }
    };

    const render = (filtered = null) => {
        let posts = filtered || Store.posts();
        postsContainer.innerHTML = posts.length ? posts.map((p, i) => `
            <div class="section fade-in">
                <h3 style="display:inline;">${p.title}${p.supporter ? UI.supporterBadge : ''}</h3>
                <p>${p.content}</p>
                ${p.image ? `<img src="${p.image}" alt="Post" style="max-width:100%;border-radius:10px;margin-top:10px;">` : ''}
                <small>By ${p.username} on ${TimeFormat.full(p.time)}</small>
                <div style="margin-top:10px;">
                    <button class="like-btn" data-i="${i}">👍 ${p.likes || 0}</button>
                </div>
                <div style="margin-top:15px;padding-top:15px;border-top:1px solid rgba(255,20,147,0.2);">
                    <h4>Comments</h4>
                    <div style="margin-bottom:10px;max-height:200px;overflow-y:auto;">
                        ${(p.comments || []).length ? p.comments.map(c => `
                            <p style="margin:8px 0;"><strong>${c.username}</strong>${c.supporter ? '★' : ''}: ${c.text}</p>
                        `).join('') : '<p style="color:#888;font-size:14px;">No comments</p>'}
                    </div>
                    <input type="text" class="comment-in" placeholder="Comment..." data-i="${i}" style="width:80%;padding:10px;">
                    <button class="comment-btn" data-i="${i}">Post</button>
                </div>
            </div>
        `).join('') : '<p>No posts yet</p>';

        document.querySelectorAll('.like-btn').forEach(b => b.onclick = () => {
            let posts = Store.posts();
            posts[parseInt(b.dataset.i)].likes = (posts[parseInt(b.dataset.i)].likes || 0) + 1;
            Store.savePosts(posts);
            if(user) checkAch(user);
            render();
        });

        document.querySelectorAll('.comment-btn').forEach(b => b.onclick = () => {
            if(!user) { alert('Login to comment'); return; }
            const txt = document.querySelector(`.comment-in[data-i="${b.dataset.i}"]`).value.trim();
            if(txt) {
                let posts = Store.posts();
                const i = parseInt(b.dataset.i);
                if(!posts[i].comments) posts[i].comments = [];
                posts[i].comments.push({ username: user.username, text: txt, supporter: user.supporter });
                Store.savePosts(posts);
                checkAch(user);
                render();
            }
        });
    };

    postForm.addEventListener('submit', e => {
        e.preventDefault();
        if(!user) { alert('Login'); window.location='login.html'; return; }
        const title = document.getElementById('postTitle').value.trim();
        const content = document.getElementById('postContent').value.trim();
        const img = document.getElementById('postImage').files[0];
        
        if(!title || !content) return;
        
        if(img) {
            const reader = new FileReader();
            reader.onload = () => {
                let posts = Store.posts();
                posts.unshift({ title, content, image: reader.result, username: user.username, supporter: user.supporter, time: Date.now(), likes: 0, comments: [] });
                Store.savePosts(posts);
                checkAch(user);
                render();
                postForm.reset();
            };
            reader.readAsDataURL(img);
        } else {
            let posts = Store.posts();
            posts.unshift({ title, content, image: null, username: user.username, supporter: user.supporter, time: Date.now(), likes: 0, comments: [] });
            Store.savePosts(posts);
            checkAch(user);
            render();
            postForm.reset();
        }
    });

    searchInput.addEventListener('input', () => {
        const q = searchInput.value.toLowerCase();
        const filtered = Store.posts().filter(p => 
            p.title.toLowerCase().includes(q) || p.content.toLowerCase().includes(q) || p.username.toLowerCase().includes(q)
        );
        render(filtered);
    });

    render();
});
