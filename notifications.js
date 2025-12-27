import { apiGet } from './auth-service.js';

const notificationsEl = document.getElementById('notificationsFeed');

async function loadNotifications() {
  const notes = await apiGet('/api/notifications');
  notificationsEl.innerHTML = '';
  notes.forEach(n => {
    const div = document.createElement('div');
    div.classList.add('notification-item');
    div.textContent = n.message;
    notificationsEl.appendChild(div);
  });
}

loadNotifications();
setInterval(loadNotifications, 60000); // refresh every 60s
