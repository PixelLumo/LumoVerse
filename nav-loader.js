// Load navigation from nav.html and inject styling
document.addEventListener('DOMContentLoaded', async () => {
  try {
    // Fetch nav content
    const navPath = window.APP_BASE ? window.APP_BASE + 'nav.html' : 'nav.html';
    const response = await fetch(navPath);
    const navContent = await response.text();
    
    // Find nav element and inject content with styling
    const navElement = document.querySelector('nav');
    if (navElement) {
      navElement.innerHTML = navContent;
      
      // Apply styling to nav links
      navElement.querySelectorAll('a').forEach(link => {
        link.style.color = '#ff1493';
        link.style.textDecoration = 'none';
        link.style.padding = '8px 15px';
        link.style.cursor = 'pointer';
      });

      // Check if user is logged in and add user info to top right
      if (typeof getCurrentUser === 'function') {
        const currentUser = getCurrentUser();
        if (currentUser) {
          // Create user info container
          const userInfoContainer = document.createElement('div');
          userInfoContainer.style.display = 'flex';
          userInfoContainer.style.alignItems = 'center';
          userInfoContainer.style.gap = '15px';
          userInfoContainer.style.marginLeft = 'auto';
          
          // Add username display
          const usernameSpan = document.createElement('span');
          const isAdmin = currentUser.role === 'admin';
          const adminBadge = isAdmin ? ' <span style="color: #ff1493; font-weight: bold; margin-left: 5px;">[ADMIN]</span>' : '';
          usernameSpan.innerHTML = `👤 ${currentUser.username}${adminBadge}`;
          usernameSpan.style.color = '#fff';
          usernameSpan.style.fontSize = '14px';
          usernameSpan.style.fontWeight = 'bold';
          
          // Add admin link if user is admin
          if (isAdmin) {
            const adminLink = document.createElement('a');
            adminLink.href = window.APP_BASE ? window.APP_BASE + 'admin.html' : 'admin.html';
            adminLink.textContent = '🛡 Admin';
            adminLink.style.color = '#ff1493';
            adminLink.style.textDecoration = 'none';
            adminLink.style.padding = '8px 15px';
            adminLink.style.cursor = 'pointer';
            adminLink.style.fontSize = '14px';
            adminLink.style.fontWeight = 'bold';
            adminLink.style.borderLeft = '1px solid #ff1493';
            adminLink.style.borderRight = '1px solid #ff1493';
            userInfoContainer.appendChild(adminLink);
          }
          
          // Add logout button
          const logoutBtn = document.createElement('a');
          logoutBtn.href = '#';
          logoutBtn.textContent = 'Logout';
          logoutBtn.style.color = '#ff1493';
          logoutBtn.style.textDecoration = 'none';
          logoutBtn.style.padding = '8px 15px';
          logoutBtn.style.cursor = 'pointer';
          logoutBtn.style.fontSize = '14px';
          logoutBtn.onclick = (e) => {
            e.preventDefault();
            if (typeof logoutUser === 'function') {
              logoutUser();
            }
          };
          
          userInfoContainer.appendChild(usernameSpan);
          userInfoContainer.appendChild(logoutBtn);
          navElement.appendChild(userInfoContainer);
        }
      }
    }
  } catch (error) {
    console.error('Failed to load navigation:', error);
  }
});
