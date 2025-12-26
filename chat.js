document.addEventListener('DOMContentLoaded', () => {
    const user = getCurrentUser();
    if(!user) { 
        alert('Login required'); 
        window.location.href = window.APP_BASE ? window.APP_BASE + 'signup.html' : '../signup.html'; 
        return; 
    }
    
    const chatBox = document.getElementById('chatBox');
    const chatForm = document.getElementById('chatForm');
    const chatInput = document.getElementById('chatMessage');
    const charCount = document.getElementById('charCount');
    
    const MAX_CHARS = 500;
    let messages = [];
    let socket = null;
    
    // Initialize Socket.IO connection
    function initSocket() {
        socket = io(API_BASE || 'http://localhost:5000', {
            auth: {
                token: localStorage.getItem('token'),
                username: user.username
            }
        });
        
        // Store username on socket for tracking
        socket.username = user.username;
        
        socket.on('connect', () => {
            console.log('✅ Connected to chat server');
        });
        
        // Listen for new messages from server
        socket.on('new_message', (data) => {
            console.log('📨 New message received:', data);
            messages.push({
                username: data.username,
                message: data.message,
                time: Date.now(),
                supporter: data.supporter || false
            });
            render();
        });
        
        socket.on('disconnect', () => {
            console.log('❌ Disconnected from chat server');
        });
        
        socket.on('error', (error) => {
            console.error('Socket error:', error);
        });
    }
    
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
    
    // Format time nicely
    function formatTime(timestamp) {
        const date = new Date(timestamp);
        const hours = String(date.getHours()).padStart(2, '0');
        const mins = String(date.getMinutes()).padStart(2, '0');
        return `${hours}:${mins}`;
    }
    
    // Escape HTML to prevent XSS
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    // Render messages
    const render = () => {
        if (messages.length === 0) {
            chatBox.innerHTML = '<div class="chat-empty">Waiting for messages... 👋</div>';
        } else {
            chatBox.innerHTML = messages.map(m => `
                <div class="chat-message">
                    <div class="chat-message-username">
                        <span>${escapeHtml(m.username)}${m.supporter ? '<span class="supporter-badge-chat">⭐ Supporter</span>' : ''}</span>
                        <span class="chat-message-time">${formatTime(m.time)}</span>
                    </div>
                    <div class="chat-message-text">${escapeHtml(m.message)}</div>
                </div>
            `).join('');
        }
        
        // Auto-scroll to bottom
        chatBox.scrollTop = chatBox.scrollHeight;
    };
    
    // Send message
    chatForm.addEventListener('submit', e => {
        e.preventDefault();
        const msg = chatInput.value.trim();
        
        if(!msg || msg.length === 0) {
            alert('Message cannot be empty');
            return;
        }
        
        if(msg.length > MAX_CHARS) {
            alert(`Message exceeds ${MAX_CHARS} characters`);
            return;
        }
        
        // Emit message to server
        if(socket && socket.connected) {
            socket.emit('send_message', {
                username: user.username,
                message: msg,
                supporter: user.role === 'supporter' || false
            });
        } else {
            alert('Not connected to chat server. Trying to reconnect...');
            initSocket();
        }
        
        // Clear input
        chatInput.value = '';
        chatInput.style.height = 'auto';
        charCount.textContent = '0';
        document.querySelector('.chat-char-count').classList.remove('warning', 'error');
    });
    
    // Initialize socket connection
    initSocket();
    
    // Initial render
    render();
});
