document.addEventListener('DOMContentLoaded', () => {
    const currentUser = getCurrentUser();
    const exclusiveSection = document.getElementById('exclusiveContentSection');
    const exclusiveContent = document.getElementById('exclusiveContent');

    // Show exclusive content section if user is logged in and is a supporter
    if(currentUser && currentUser.supporter) {
        if(exclusiveSection) {
            exclusiveSection.style.display = 'block';
            if(exclusiveContent) {
                exclusiveContent.innerHTML = `
                    <li>Exclusive Game Guides & Tutorials</li>
                    <li>Behind-the-scenes development posts</li>
                    <li>Special supporter badges & achievements</li>
                    <li>Priority access to new features</li>
                    <li>Early access to beta content</li>
                    <li>Exclusive supporter-only posts and tutorials</li>
                    <li>Special voting on upcoming features</li>
                    <li>Direct feedback channel</li>
                `;
            }
        }
    }
});
