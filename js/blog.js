document.addEventListener('DOMContentLoaded', () => {
    let blogPosts = JSON.parse(localStorage.getItem('pixellumoBlog')) || [];
    const blogContainer = document.getElementById('blogContainer');
    const blogSearch = document.getElementById('blogSearch');

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
            div.innerHTML = `
                <h3>${post.title}</h3>
                <p>${post.content}</p>
                <small>Posted on ${new Date(post.time).toLocaleDateString()}</small>
            `;
            blogContainer.appendChild(div);
        });
    }

    blogSearch.addEventListener('input', () => {
        const query = blogSearch.value.toLowerCase();
        const filtered = blogPosts.filter(p => 
            p.title.toLowerCase().includes(query) || 
            p.content.toLowerCase().includes(query)
        );
        displayPosts(filtered);
    });

    displayPosts();
});
