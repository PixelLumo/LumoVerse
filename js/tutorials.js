document.addEventListener('DOMContentLoaded', () => {
    const tutorialForm = document.getElementById('tutorialForm');
    const tutorialsContainer = document.getElementById('tutorialsContainer');
    const searchInput = document.getElementById('tutorialSearch');
    const currentUser = getCurrentUser();
    let tutorials = JSON.parse(localStorage.getItem('pixellumoTutorials')) || [];

    // Social media platform mappings
    const socialPlatforms = {
        twitter: { name: 'Twitter', emoji: '𝕏', placeholder: 'https://x.com/yourhandle' },
        discord: { name: 'Discord', emoji: '💬', placeholder: 'https://discordapp.com/users/userid' },
        twitch: { name: 'Twitch', emoji: '📺', placeholder: 'https://twitch.tv/yourhandle' },
        youtube: { name: 'YouTube', emoji: '▶️', placeholder: 'https://youtube.com/@yourhandle' },
        instagram: { name: 'Instagram', emoji: '📸', placeholder: 'https://instagram.com/yourhandle' }
    };

    // Handle social media platform selection
    const socialRadios = document.querySelectorAll('input[name="socialPlatform"]');
    const socialLinkInput = document.getElementById('socialLinkInput');
    const socialInputLabel = document.getElementById('socialInputLabel');
    const socialLinkField = document.getElementById('socialLink');

    socialRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            if (radio.value === 'none') {
                socialLinkInput.classList.remove('active');
                socialLinkField.style.display = 'none';
                socialLinkField.value = '';
            } else {
                socialLinkInput.classList.add('active');
                socialLinkField.style.display = 'block';
                const platform = socialPlatforms[radio.value];
                socialInputLabel.textContent = `Enter your ${platform.name} link:`;
                socialLinkField.placeholder = platform.placeholder;
                socialLinkField.focus();
            }
        });
    });

    function getSocialContactHTML(tutorial) {
        if (!tutorial.socialPlatform || tutorial.socialPlatform === 'none') {
            return '';
        }

        const platform = socialPlatforms[tutorial.socialPlatform];
        if (!platform || !tutorial.socialLink) {
            return '';
        }

        return `<span class="author-contact-display">
            <a href="${tutorial.socialLink}" target="_blank" class="author-contact-link" title="Contact ${tutorial.username} on ${platform.name}">
                ${platform.emoji} Contact ${tutorial.username}
            </a>
        </span>`;
    }

    function displayTutorials(filtered = null) {
        tutorialsContainer.innerHTML = '';
        const list = filtered || tutorials;
        if(list.length === 0) {
            tutorialsContainer.innerHTML = '<p>No tutorials yet! Be the first to share a guide.</p>';
            return;
        }
        list.forEach((tut, idx) => {
            // Hide supporter-only tutorials from non-supporters
            if(tut.supportersOnly && !currentUser?.supporter) {
                return;
            }

            const div = document.createElement('div');
            div.className = 'section fade-in';
            
            // Supporter badge
            const supporterBadge = tut.supportersOnly ? '<span style="display:inline-block;background:linear-gradient(135deg,#ff1493,#ff69b4);color:white;padding:4px 10px;border-radius:20px;font-size:11px;font-weight:bold;margin-left:10px;vertical-align:middle;">🔒 SUPPORTERS ONLY</span>' : '';
            const authorBadge = tut.supporter ? '<span style="display:inline-block;background:linear-gradient(135deg,#ff1493,#ff69b4);color:white;padding:4px 10px;border-radius:20px;font-size:11px;font-weight:bold;margin-left:8px;vertical-align:middle;">★ SUPPORTER</span>' : '';
            
            const socialContactHTML = getSocialContactHTML(tut);
            
            div.innerHTML = `
                <h3 style="display:inline;">${tut.title}${supporterBadge}</h3>
                <p>${tut.content}</p>
                <small>By ${tut.username}${authorBadge} on ${new Date(tut.time).toLocaleString()}${socialContactHTML}</small>
            `;
            tutorialsContainer.appendChild(div);
        });
    }

    tutorialForm.addEventListener('submit', e => {
        e.preventDefault();
        if(!currentUser) { 
            alert('Login to post a tutorial.'); 
            window.location.href = 'login.html';
            return; 
        }

        const title = document.getElementById('tutorialTitle').value.trim();
        const content = document.getElementById('tutorialContent').value.trim();
        const supportersOnly = document.getElementById('tutorialSupportersOnly')?.checked || false;
        const socialPlatform = document.querySelector('input[name="socialPlatform"]:checked')?.value || 'none';
        let socialLink = '';

        if (socialPlatform !== 'none') {
            socialLink = document.getElementById('socialLink').value.trim();
            if (!socialLink) {
                alert(`Please enter your ${socialPlatforms[socialPlatform].name} link or select "Don't share"`);
                return;
            }
            // Basic URL validation
            if (!socialLink.startsWith('http://') && !socialLink.startsWith('https://')) {
                alert('Please enter a valid URL (starting with http:// or https://)');
                return;
            }
        }

        if(title && content) {
            const newTut = {
                title, 
                content, 
                username: currentUser.username,
                supporter: currentUser.supporter || false,
                supportersOnly: supportersOnly && currentUser.supporter,
                socialPlatform: socialPlatform,
                socialLink: socialLink,
                time: Date.now()
            };
            tutorials.unshift(newTut);
            localStorage.setItem('pixellumoTutorials', JSON.stringify(tutorials));
            displayTutorials();
            tutorialForm.reset();
            document.getElementById('socialLinkInput').classList.remove('active');
            document.getElementById('socialLink').style.display = 'none';
            alert('Tutorial posted! Thanks for contributing.');
        }
    });

    searchInput.addEventListener('input', () => {
        const query = searchInput.value.toLowerCase();
        const filtered = tutorials.filter(tut => {
            // Hide supporter-only from non-supporters in search too
            if(tut.supportersOnly && !currentUser?.supporter) return false;
            return tut.title.toLowerCase().includes(query) || 
                   tut.content.toLowerCase().includes(query) ||
                   tut.username.toLowerCase().includes(query);
        });
        displayTutorials(filtered);
    });

    displayTutorials();
});

