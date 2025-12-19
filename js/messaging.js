document.addEventListener('DOMContentLoaded', () => {
    const user = getCurrentUser();
    if(!user) { window.location.href='login.html'; return; }
    
    const usersList = document.getElementById('usersList');
    const messageBox = document.getElementById('messageBox');
    const messageForm = document.getElementById('messageForm');
    const messageInput = document.getElementById('messageInput');
    const chatHeader = document.getElementById('chatHeader');
    const msgNotifCount = document.getElementById('msgNotifCount');
    
    let selected = null;
    const posts = Store.posts();
    const users = new Set([user.username]);
    
    posts.forEach(p => {
        users.add(p.username);
        if(p.comments) p.comments.forEach(c => users.add(c.username));
    });
    
    const others = Array.from(users).filter(u => u !== user.username);
    
    const renderUsers = () => {
        usersList.innerHTML = others.length ? others.map(u => {
            const key = getConvKey(user.username, u);
            const msgs = (Store.messages()[key] || []).filter(m => m.receiver === user.username && !m.read);
            const badge = msgs.length ? `<span class="unread-badge">${msgs.length}</span>` : '';
            return `<div class="user-item${selected === u ? ' active' : ''}" onclick="window.selectUser('${u}')">${u}${badge}</div>`;
        }).join('') : '<p style="color:#888;">No users yet</p>';
    };
    
    const renderMsgs = (u) => {
        const key = getConvKey(user.username, u);
        const msgs = Store.messages()[key] || [];
        messageBox.innerHTML = msgs.length ? msgs.map(m => `
            <div class="message ${m.sender === user.username ? 'sent' : 'received'}">
                <div>${m.text}</div>
                <div class="message-time">${TimeFormat.short(m.time)}</div>
            </div>
        `).join('') : '<div class="empty-chat">Start the conversation!</div>';
        messageBox.scrollTop = messageBox.scrollHeight;
    };
    
    window.selectUser = (u) => {
        selected = u;
        chatHeader.textContent = `💬 Chat with ${u}`;
        messageForm.style.display = 'flex';
        renderMsgs(u);
        renderUsers();
        // Mark as read
        const key = getConvKey(user.username, u);
        let allMsgs = Store.messages();
        (allMsgs[key] || []).forEach(m => { if(m.receiver === user.username) m.read = true; });
        Store.saveMessages(allMsgs);
        updateCount();
    };
    
    const updateCount = () => {
        let total = 0;
        Object.values(Store.messages()).forEach(arr => 
            total += arr.filter(m => m.receiver === user.username && !m.read).length
        );
        NotifyHelper.updateBadge('msgNotifCount', total);
    };
    
    messageForm.addEventListener('submit', e => {
        e.preventDefault();
        const txt = messageInput.value.trim();
        if(txt && selected) {
            const key = getConvKey(user.username, selected);
            let allMsgs = Store.messages();
            if(!allMsgs[key]) allMsgs[key] = [];
            allMsgs[key].push({ sender: user.username, receiver: selected, text: txt, time: Date.now(), read: false });
            Store.saveMessages(allMsgs);
            messageInput.value = '';
            renderMsgs(selected);
            updateCount();
        }
    });
    
    renderUsers();
    updateCount();
    setInterval(() => { if(selected) renderMsgs(selected); updateCount(); }, 2000);
});
