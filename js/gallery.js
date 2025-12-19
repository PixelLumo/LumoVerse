document.addEventListener('DOMContentLoaded', () => {
    const galleryForm = document.getElementById('galleryForm');
    const galleryContainer = document.getElementById('galleryContainer');
    const gallerySearch = document.getElementById('gallerySearch');
    let images = JSON.parse(localStorage.getItem('pixellumoImages')) || [];

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
                </div>
            `;
            galleryContainer.appendChild(div);
        });
    }

    galleryForm.addEventListener('submit', e => {
        e.preventDefault();
        const currentUser = getCurrentUser();
        if(!currentUser) { 
            alert('Login to upload images.'); 
            window.location.href = 'login.html';
            return; 
        }

        const title = document.getElementById('imageTitle').value.trim();
        const file = document.getElementById('imageFile').files[0];
        if(title && file) {
            const reader = new FileReader();
            reader.onload = function(ev) {
                const newImg = {
                    title, 
                    data: ev.target.result, 
                    username: currentUser.username,
                    time: Date.now()
                };
                images.unshift(newImg);
                localStorage.setItem('pixellumoImages', JSON.stringify(images));
                displayImages();
                galleryForm.reset();
                alert('Image uploaded! Thanks for sharing.');
            }
            reader.readAsDataURL(file);
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

    displayImages();
});
