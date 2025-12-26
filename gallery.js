document.addEventListener('DOMContentLoaded', async () => {
    const galleryForm = document.getElementById('galleryForm');
    const galleryContainer = document.getElementById('galleryContainer');
    const gallerySearch = document.getElementById('gallerySearch');
    let images = [];

    // Fetch images from backend API
    async function loadImages() {
        try {
            const response = await fetch(`${API_BASE}/api/posts`);
            if (!response.ok) throw new Error('Failed to load images');
            
            const posts = await response.json();
            // Filter posts that have images
            images = posts.filter(p => p.file_path).map(p => ({
                id: p.id,
                title: p.title,
                data: p.file_path,
                username: p.username,
                time: new Date(p.created_at).getTime()
            }));
            
            displayImages();
        } catch (error) {
            console.error('Error loading images:', error);
            galleryContainer.innerHTML = '<p style="color: #ff4444;">Error loading gallery</p>';
        }
    }

    function displayImages(filtered = null) {
        galleryContainer.innerHTML = '';
        const list = filtered || images;
        if(list.length === 0) { 
            galleryContainer.innerHTML = '<p>No images yet! Be the first to share your creations.</p>'; 
            return; 
        }
        list.forEach(img => {
            const div = document.createElement('div');
            div.className = 'gallery-item';
            div.innerHTML = `
                <img src="${img.data}" alt="${img.title}" style="cursor:pointer;" onclick="this.style.maxHeight=this.style.maxHeight==='none'?'200px':'none';">
                <div class="gallery-item-info">
                    <div class="gallery-item-title">${img.title}</div>
                    <div class="gallery-item-author">by ${img.username}</div>
                    <div style="font-size:11px;color:#999;margin-top:5px;">${new Date(img.time).toLocaleDateString()}</div>
                </div>
            `;
            galleryContainer.appendChild(div);
        });
    }

    galleryForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const currentUser = getCurrentUser();
        if(!currentUser) { 
            alert('Login to upload images.'); 
            window.location.href = window.APP_BASE ? window.APP_BASE + 'signup.html' : '../signup.html';
            return; 
        }

        const title = document.getElementById('imageTitle').value.trim();
        const file = document.getElementById('imageFile').files[0];
        
        if(!title || !file) {
            alert('Please enter a title and select an image');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const formData = new FormData();
            formData.append('title', title);
            formData.append('content', title); // Use title as content too
            formData.append('file', file);

            const response = await fetch(`${API_BASE}/api/posts`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            if (!response.ok) {
                throw new Error('Upload failed');
            }

            alert('Image uploaded! Thanks for sharing.');
            galleryForm.reset();
            await loadImages(); // Reload gallery
        } catch (error) {
            console.error('Error uploading image:', error);
            alert('Failed to upload image: ' + error.message);
        }
    });

    gallerySearch.addEventListener('input', () => {
        const query = gallerySearch.value.toLowerCase();
        const filtered = images.filter(img => 
            img.title.toLowerCase().includes(query) || 
            img.username.toLowerCase().includes(query)
        );
        displayImages(filtered);
    });

    // Load images on page load
    await loadImages();
});
