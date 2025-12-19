/**
 * PixelLumo - Shared Utilities
 * Common functions used across all pages
 */

// Notification utilities
const NotifyHelper = {
    updateBadge(id, count) {
        const el = document.getElementById(id);
        if(el) el.textContent = Math.min(count, 99);
    },
    
    countUnreadMessages() {
        const user = getCurrentUser();
        if(!user) return 0;
        const msgs = JSON.parse(localStorage.getItem('pixellumoMessages')) || {};
        return Object.values(msgs).reduce((sum, arr) => 
            sum + arr.filter(m => m.receiver === user.username && !m.read).length, 0);
    },
    
    updateAllBadges() {
        this.updateBadge('chatNotifCount', 0);
        this.updateBadge('msgNotifCount', this.countUnreadMessages());
    }
};

// Storage utilities - shorter keys to save space
const Store = {
    posts: () => JSON.parse(localStorage.getItem('pixellumoPosts')) || [],
    savePosts: (data) => localStorage.setItem('pixellumoPosts', JSON.stringify(data)),
    
    chat: () => JSON.parse(localStorage.getItem('pixellumoChat')) || [],
    saveChat: (data) => localStorage.setItem('pixellumoChat', JSON.stringify(data)),
    
    messages: () => JSON.parse(localStorage.getItem('pixellumoMessages')) || {},
    saveMessages: (data) => localStorage.setItem('pixellumoMessages', JSON.stringify(data)),
    
    tutorials: () => JSON.parse(localStorage.getItem('pixellumoTutorials')) || [],
    saveTutorials: (data) => localStorage.setItem('pixellumoTutorials', JSON.stringify(data)),
    
    images: () => JSON.parse(localStorage.getItem('pixellumoImages')) || [],
    saveImages: (data) => localStorage.setItem('pixellumoImages', JSON.stringify(data)),
    
    blog: () => JSON.parse(localStorage.getItem('pixellumoBlog')) || [],
    saveBlog: (data) => localStorage.setItem('pixellumoBlog', JSON.stringify(data)),
    
    notifs: (user) => JSON.parse(localStorage.getItem(`pixellumoNotifications_${user}`)) || [],
    saveNotifs: (user, data) => localStorage.setItem(`pixellumoNotifications_${user}`, JSON.stringify(data))
};

// Format date/time
const TimeFormat = {
    short: (ms) => new Date(ms).toLocaleTimeString(),
    full: (ms) => new Date(ms).toLocaleString(),
    date: (ms) => new Date(ms).toLocaleDateString()
};

// Render helpers
const UI = {
    supporterBadge: '<span style="display:inline-block;background:linear-gradient(135deg,#ff1493,#ff69b4);color:white;padding:4px 10px;border-radius:20px;font-size:11px;font-weight:bold;margin-left:10px;">★ SUPPORTER</span>',
    
    empty: (msg = "No content yet") => `<p style="color:#888;text-align:center;padding:20px;">${msg}</p>`
};

// Conversation key for DMs
function getConvKey(u1, u2) {
    return [u1, u2].sort().join('_');
}

// Event trigger for cross-tab communication
function triggerUpdate(type) {
    window.dispatchEvent(new CustomEvent('pixellumoUpdate', { detail: { type } }));
}
