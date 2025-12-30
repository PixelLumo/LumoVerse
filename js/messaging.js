import { supabase } from './supabase.js';

const chatForm = document.getElementById('chatForm');
const chatInput = document.getElementById('chatInput');
const chatWindow = document.getElementById('chatWindow');

async function loadMessages() {
  const { data, error } = await supabase.from('messages').select('*').order('created_at', { ascending: true });
  if (error) return console.error(error);
  chatWindow.innerHTML = '';
  data.forEach(msg => {
    const div = document.createElement('div');
    div.textContent = `${msg.user_email}: ${msg.content}`;
    chatWindow.appendChild(div);
  });
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

// Send message
if (chatForm) {
  chatForm.addEventListener('submit', async e => {
    e.preventDefault();
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) return alert('Login first');
    const content = chatInput.value;
    await supabase.from('messages').insert([{ user_email: user.email, content }]);
    chatInput.value = '';
    loadMessages();
  });
}

// Real-time subscription
supabase.from('messages').on('INSERT', payload => {
  loadMessages();
}).subscribe();

loadMessages();
