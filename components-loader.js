// Load header and footer components
function loadComponents() {
    // Load header
    const headerPlaceholder = document.querySelector('header');
    if (headerPlaceholder && headerPlaceholder.children.length === 0) {
        fetch(window.APP_BASE + 'header.html')
            .then(response => response.text())
            .then(data => {
                headerPlaceholder.innerHTML = data;
                loadNavigation();
            })
            .catch(error => console.error('Error loading header:', error));
    }

    // Load footer
    const footerPlaceholder = document.querySelector('footer');
    if (footerPlaceholder && footerPlaceholder.children.length === 0) {
        fetch(window.APP_BASE + 'footer.html')
            .then(response => response.text())
            .then(data => {
                footerPlaceholder.innerHTML = data;
            })
            .catch(error => console.error('Error loading footer:', error));
    }
}

// Load components when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadComponents);
} else {
    loadComponents();
}
