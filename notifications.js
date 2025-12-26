document.addEventListener('DOMContentLoaded', () => {
    const currentUser = getCurrentUser();
    const container = document.getElementById('notificationsContainer');
    
    if(!currentUser) {
        window.location.href = 'login.html';
        return;
    }

    let notifications = JSON.parse(localStorage.getItem('pixellumoNotifications_' + currentUser.username)) || [];
    let currentFilter = 'all';

    function generateNotifications() {
        // Clear existing notifications
        let newNotifications = [];

        // Check for unread messages
        const messages = JSON.parse(localStorage.getItem('pixellumoMessages')) || {};
        Object.entries(messages).forEach(([convKey, msgs]) => {
            msgs.forEach(msg => {
                if(msg.receiver === currentUser.username && !msg.read) {
                    // Only create one notification per conversation
                    if(!newNotifications.some(n => n.type === 'message' && n.from === msg.sender)) {
                        newNotifications.push({
                            type: 'message',
                            from: msg.sender,
                            title: `New message from ${msg.sender}`,
                            body: `"${msg.text.substring(0, 50)}${msg.text.length > 50 ? '...' : ''}"`,
                            time: msg.time,
                            read: false,
                            id: `msg_${msg.sender}_${msg.time}`
                        });
                    }
                }
            });
        });

        // Check for new chat messages
        const chatMessages = JSON.parse(localStorage.getItem('pixellumoChat')) || [];
        const chatNotif = chatMessages.slice(-5).some(m => m.username !== currentUser.username);
        if(chatNotif && !newNotifications.some(n => n.type === 'chat')) {
            newNotifications.unshift({
                type: 'activity',
                title: '💬 New chat messages',
                body: 'There are new messages in the community chat',
                time: Date.now(),
                read: false,
                id: 'chat_' + Date.now()
            });
        }

        // Check for new posts/comments
        const posts = JSON.parse(localStorage.getItem('pixellumoPosts')) || [];
        const recentPost = posts[0];
        if(recentPost && recentPost.username !== currentUser.username && 
           !newNotifications.some(n => n.type === 'activity' && n.id === 'new_post')) {
            newNotifications.unshift({
                type: 'activity',
                title: '📝 New community post',
                body: `${recentPost.username} posted: "${recentPost.title}"`,
                time: recentPost.time,
                read: false,
                id: 'new_post'
            });
        }

        // Check for achievements
        const achievements = JSON.parse(localStorage.getItem('userAchievements_' + currentUser.username)) || [];
        if(achievements.length > 0) {
            const lastAch = achievements[achievements.length - 1];
            if(!newNotifications.some(n => n.type === 'achievements' && n.body.includes(lastAch))) {
                newNotifications.push({
                    type: 'achievements',
                    title: '🏆 Achievement Unlocked',
                    body: `You unlocked: ${lastAch}!`,
                    time: Date.now(),
                    read: false,
                    id: `ach_${lastAch}`
                });
            }
        }

        // Supporter notification
        if(currentUser.supporter && !newNotifications.some(n => n.type === 'supporter')) {
            newNotifications.push({
                type: 'supporter',
                title: '★ Supporter Perks Active',
                body: 'You have access to exclusive supporter content and bonus leaderboard points',
                time: Date.now(),
                read: true,
                id: 'supporter_perk'
            });
        }

        // Save notifications
        notifications = newNotifications;
        localStorage.setItem('pixellumoNotifications_' + currentUser.username, JSON.stringify(notifications));
    }

    function renderNotifications() {
        generateNotifications();
        
        const filtered = notifications.filter(n => currentFilter === 'all' || n.type === currentFilter);

        if(filtered.length === 0) {
            container.innerHTML = `
                <div class="empty-notifications">
                    <div class="empty-notifications-icon">🎉</div>
                    <h3>All caught up!</h3>
                    <p>You have no ${currentFilter !== 'all' ? currentFilter : ''} notifications right now.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = '';
        filtered.forEach(notif => {
            const div = document.createElement('div');
            div.className = 'notification-item' + (!notif.read ? ' unread' : '');
            
            const time = new Date(notif.time).toLocaleString();
            const typeEmoji = {
                message: '💬',
                activity: '📝',
                achievements: '🏆',
                supporter: '★',
                chat: '💬'
            }[notif.type] || '📢';

            div.innerHTML = `
                <div class="notification-header">
                    <div class="notification-title">
                        <span class="notification-icon">${typeEmoji}</span>
                        ${notif.title}
                    </div>
                    <span class="notification-time">${time}</span>
                </div>
                <div class="notification-body">${notif.body}</div>
                ${notif.type === 'message' ? `<a href="messaging.html" class="notification-action">→ Open message</a>` : ''}
                ${notif.type === 'activity' && !notif.body.includes('post') ? `<a href="chat.html" class="notification-action">→ Go to chat</a>` : ''}
                ${notif.type === 'activity' && notif.body.includes('post') ? `<a href="community.html" class="notification-action">→ View posts</a>` : ''}
            `;
            container.appendChild(div);
        });
    }

    // Make functions global
    window.markAllAsRead = function() {
        notifications.forEach(n => n.read = true);
        localStorage.setItem('pixellumoNotifications_' + currentUser.username, JSON.stringify(notifications));
        renderNotifications();
    };

    window.filterNotifications = function(type) {
        currentFilter = type;
        document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
        event.target.classList.add('active');
        renderNotifications();
    };

    // Initial render
    renderNotifications();

    // Auto-refresh every 3 seconds
    setInterval(() => {
        renderNotifications();
    }, 3000);
});
