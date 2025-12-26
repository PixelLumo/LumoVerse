document.addEventListener('DOMContentLoaded', async () => {
    const user = getCurrentUser();
    if(!user) { 
        window.location.href = window.APP_BASE ? window.APP_BASE + 'signup.html' : '../signup.html'; 
        return; 
    }
    
    const usersList = document.getElementById('usersList');
    const messageBox = document.getElementById('messageBox');
    const messageForm = document.getElementById('messageForm');
    const messageInput = document.getElementById('messageInput');
    const chatHeader = document.getElementById('chatHeader');
    
    let selected = null;
    let availableUsers = [];
    
    // Fetch users who accept messages
    async function loadUsers() {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE}/api/messaging/users`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if(!response.ok) throw new Error('Failed to load users');
            
            availableUsers = await response.json();
            renderUsers();
        } catch (error) {
            console.error('Error loading users:', error);
            usersList.innerHTML = `<p style="color:#ff4444;">Error loading users</p>`;
        }
    }
    
    const renderUsers = () => {
        usersList.innerHTML = availableUsers.length 
            ? availableUsers.map(u => `
                <div class="user-item${selected === u.username ? ' active' : ''}" onclick="window.selectUser('${u.username}')">
                    ${u.avatar ? `<img src="${u.avatar}" style="width:20px;height:20px;border-radius:50%;margin-right:8px;">` : '👤'}
                    ${u.username}
                </div>
            `).join('')
            : '<p style="color:#888; font-size:12px;">No users available</p>';
    };
    
    const renderMsgs = (u) => {
        messageBox.innerHTML = '<div class="empty-chat">Start the conversation!</div>';
        messageBox.scrollTop = messageBox.scrollHeight;
    };
    
    window.selectUser = (u) => {
        selected = u;
        chatHeader.textContent = `💬 Chat with ${u}`;
        messageForm.style.display = 'flex';
        renderMsgs(u);
        renderUsers();
    };
    
    messageForm.addEventListener('submit', e => {
        e.preventDefault();
        const txt = messageInput.value.trim();
        if(txt && selected) {
            // TODO: Implement backend private messaging
            alert('Private messaging backend coming soon');
            messageInput.value = '';
        }
    });
    
    // Load users on page load
    await loadUsers();
});
    renderUsers();
    updateCount();
    setInterval(() => { if(selected) renderMsgs(selected); updateCount(); }, 2000);
});
