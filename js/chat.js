document.addEventListener('DOMContentLoaded', () => {
    const user = getCurrentUser();
    if(!user) { alert('Login required'); window.location.href='login.html'; return; }
    
    const chatBox = document.getElementById('chatBox');
    const chatForm = document.getElementById('chatForm');
    const chatInput = document.getElementById('chatMessage');
    const charCount = document.getElementById('charCount');
    const notifCount = document.getElementById('chatNotifCount');
    
    const MAX_CHARS = 500;
    
    // Update character count as user types
    chatInput.addEventListener('input', () => {
        const length = chatInput.value.length;
        charCount.textContent = length;
        
        const charCountEl = document.querySelector('.chat-char-count');
        if (length > MAX_CHARS) {
            charCountEl.classList.add('error');
            chatInput.value = chatInput.value.substring(0, MAX_CHARS);
            charCount.textContent = MAX_CHARS;
        } else if (length > MAX_CHARS * 0.8) {
            charCountEl.classList.add('warning');
            charCountEl.classList.remove('error');
        } else {
            charCountEl.classList.remove('warning', 'error');
        }
    });
    
    // Auto-expand textarea as user types
    chatInput.addEventListener('input', () => {
        chatInput.style.height = 'auto';
        const newHeight = Math.min(chatInput.scrollHeight, 250);
        chatInput.style.height = newHeight + 'px';
    });
    
    const render = () => {
        let msgs = Store.chat();
        chatBox.innerHTML = msgs.length ? msgs.map(m => `
            <div class="chat-message">
                <div class="chat-message-username">
                    <span>${m.username}${m.supporter ? UI.supporterBadge.substring(68) : ''}</span>
                    <span class="chat-message-time">${TimeFormat.short(m.time)}</span>
                </div>
                <div class="chat-message-text">${m.message}</div>
            </div>
        `).join('') : '<div class="chat-empty">No messages yet. Be first! 👋</div>';
        
        chatBox.scrollTop = chatBox.scrollHeight;
        NotifyHelper.updateBadge('chatNotifCount', msgs.filter(m => m.username !== user.username).length);
    };
    
    chatForm.addEventListener('submit', e => {
        e.preventDefault();
        const msg = chatInput.value.trim();
        if(msg && msg.length <= MAX_CHARS) {
            let msgs = Store.chat();
            msgs.push({ username: user.username, message: msg, time: Date.now(), supporter: user.supporter || false });
            Store.saveChat(msgs);
            chatInput.value = '';
            chatInput.style.height = 'auto';
            charCount.textContent = '0';
            document.querySelector('.chat-char-count').classList.remove('warning', 'error');
            render();
        }
    });
    
    render();
    setInterval(render, 2000);
});
