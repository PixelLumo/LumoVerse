import { apiGet, apiPost } from './auth-service.js';

const chatWindow = document.getElementById('chatWindow');
const chatForm = document.getElementById('chatForm');
const chatInput = document.getElementById('chatInput');

async function loadMessages() {
  try {
    const messages = await apiGet('/api/chat');
    chatWindow.innerHTML = '';
    messages.forEach(msg => {
      const div = document.createElement('div');
      div.innerHTML = `<strong>${msg.user}:</strong> ${msg.message}`;
      chatWindow.appendChild(div);
    });
    chatWindow.scrollTop = chatWindow.scrollHeight;
  } catch (err) {
    console.error('Failed to load chat messages:', err);
  }
}

chatForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const message = chatInput.value.trim();
  if (!message) return;
  try {
    await apiPost('/api/chat', { message });
    chatInput.value = '';
    loadMessages();
  } catch (err) {
    console.error('Failed to send message:', err);
  }
});

loadMessages();
setInterval(loadMessages, 5000); // refresh every 5 seconds
