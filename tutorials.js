document.addEventListener('DOMContentLoaded', async () => {
    const tutorialForm = document.getElementById('tutorialForm');
    const tutorialsContainer = document.getElementById('tutorialsContainer');
    const searchInput = document.getElementById('tutorialSearch');
    const currentUser = getCurrentUser();
    let tutorials = [];

    // Fetch tutorials from backend API
    async function loadTutorials() {
        try {
            const response = await fetch(`${API_BASE}/api/posts`);
            if (!response.ok) throw new Error('Failed to load tutorials');
            
            const posts = await response.json();
            // Filter posts (we'll use a different approach - store type in content)
            tutorials = posts.map(p => ({
                id: p.id,
                title: p.title,
                content: p.content,
                username: p.username,
                supporter: p.role === 'supporter',
                time: new Date(p.created_at).getTime()
            }));
            
            displayTutorials();
        } catch (error) {
            console.error('Error loading tutorials:', error);
            tutorialsContainer.innerHTML = '<p style="color: #ff4444;">Error loading tutorials</p>';
        }
    }

    function displayTutorials(filtered = null) {
        tutorialsContainer.innerHTML = '';
        const list = filtered || tutorials;
        if(list.length === 0) {
            tutorialsContainer.innerHTML = '<p>No tutorials yet! Be the first to share a guide.</p>';
            return;
        }
        list.forEach((tut) => {
            const div = document.createElement('div');
            div.className = 'section fade-in';
            
            const authorBadge = tut.supporter ? '<span style="display:inline-block;background:linear-gradient(135deg,#ff1493,#ff69b4);color:white;padding:4px 10px;border-radius:20px;font-size:11px;font-weight:bold;margin-left:8px;vertical-align:middle;">★ SUPPORTER</span>' : '';
            
            div.innerHTML = `
                <h3 style="display:inline;">${tut.title}</h3>
                <p>${tut.content}</p>
                <small>By <strong>${tut.username}</strong>${authorBadge} on ${new Date(tut.time).toLocaleString()}</small>
            `;
            tutorialsContainer.appendChild(div);
        });
    }

    tutorialForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        if(!currentUser) { 
            alert('Login to post a tutorial.'); 
            window.location.href = window.APP_BASE ? window.APP_BASE + 'signup.html' : '../signup.html';
            return; 
        }

        const title = document.getElementById('tutorialTitle').value.trim();
        const content = document.getElementById('tutorialContent').value.trim();

        if(!title || !content) {
            alert('Please enter both title and content');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE}/api/posts`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title: title,
                    content: content
                })
            });

            if (!response.ok) {
                throw new Error('Failed to post tutorial');
            }

            alert('Tutorial posted! Thanks for contributing.');
            tutorialForm.reset();
            await loadTutorials(); // Reload tutorials
        } catch (error) {
            console.error('Error posting tutorial:', error);
            alert('Failed to post tutorial: ' + error.message);
        }
    });

    searchInput.addEventListener('input', () => {
        const query = searchInput.value.toLowerCase();
    searchInput.addEventListener('input', () => {
        const query = searchInput.value.toLowerCase();
        const filtered = tutorials.filter(tut => 
            tut.title.toLowerCase().includes(query) || 
            tut.content.toLowerCase().includes(query) ||
            tut.username.toLowerCase().includes(query)
        );
        displayTutorials(filtered);
    });

    // Load tutorials on page load
    await loadTutorials();
});

