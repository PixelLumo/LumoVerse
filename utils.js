// [TODO 1 COMPLETED] Obsolete scripts.js removed and utils.js cleaned up. Proceeding to add css/fonts.css and update HTML imports.
/**
 * PixelLumo - Shared Utilities
 * Common functions used across all pages
 * 
 * ⚠️ IMPORTANT: All data should be fetched from the server (via API_BASE endpoints)
 * The Store object below is DEPRECATED and exists only for backwards compatibility.
 * Use the global 'storage' object (from storage-service.js) for all data access instead.
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

// Storage utilities have been migrated to storage-service.js
// Remove any usage of the Store object. Use the global 'storage' object from storage-service.js instead.

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
