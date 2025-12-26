import { apiGet } from './auth-service.js';

const blogSection = document.getElementById('blogPosts');

async function loadBlogPosts() {
  try {
    const posts = await apiGet('/api/posts');
    blogSection.innerHTML = '';
    posts.forEach(post => {
      const card = document.createElement('div');
      card.classList.add('card');
      card.innerHTML = `
        <h3>${post.title}</h3>
        <p>${post.excerpt}</p>
        <a href="/pages/blog.html?id=${post.id}" class="btn-secondary">Read More</a>
      `;
      blogSection.appendChild(card);
    });
  } catch (err) {
    console.error('Failed to load blog posts:', err);
    blogSection.innerHTML = '<p>Failed to load posts.</p>';
  }
}

loadBlogPosts();
