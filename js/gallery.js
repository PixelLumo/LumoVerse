import { apiGet } from './auth-service.js';

const gallerySection = document.getElementById('galleryGrid');

async function loadGallery() {
  try {
    const images = await apiGet('/api/gallery');
    gallerySection.innerHTML = '';
    images.forEach(img => {
      const div = document.createElement('div');
      div.classList.add('gallery-item');
      div.innerHTML = `<img src="${img.url}" alt="${img.caption}" style="width:100%; border-radius:8px;">`;
      gallerySection.appendChild(div);
    });
  } catch (err) {
    console.error('Failed to load gallery:', err);
    gallerySection.innerHTML = '<p>Gallery is empty.</p>';
  }
}

loadGallery();
