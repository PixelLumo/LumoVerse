import { apiGet, apiPost } from './auth-service.js';

const conversationsEl = document.getElementById('conversations');
const messageWindow = document.getElementById('messageWindow');
const messageForm = document.getElementById('messageForm');
const messageInput = document.getElementById('messageInput');

let currentConversation = null;

async function loadConversations() {
  const convs = await apiGet('/api/messages/conversations');
  conversationsEl.innerHTML = '';
  convs.forEach(c => {
    const div = document.createElement('div');
    div.textContent = c.name;
    div.classList.add('conversation-item');
    div.addEventListener('click', () => loadConversation(c.id));
    conversationsEl.appendChild(div);
  });
}

async function loadConversation(id) {
  currentConversation = id;
  const messages = await apiGet(`/api/messages/${id}`);
  messageWindow.innerHTML = '';
  messages.forEach(m => {
    const div = document.createElement('div');
    div.innerHTML = `<strong>${m.sender}:</strong> ${m.message}`;
    messageWindow.appendChild(div);
  });
  messageWindow.scrollTop = messageWindow.scrollHeight;
}

messageForm.addEventListener('submit', async e => {
  e.preventDefault();
  if (!currentConversation) return;
  const msg = messageInput.value.trim();
  if (!msg) return;
  await apiPost(`/api/messages/${currentConversation}`, { message: msg });
  messageInput.value = '';
  loadConversation(currentConversation);
});

loadConversations();
