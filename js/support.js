import { apiPost } from './auth-service.js';

const supportForm = document.getElementById('supportForm');

supportForm.addEventListener('submit', async e => {
  e.preventDefault();
  const subject = supportForm.subject.value.trim();
  const message = supportForm.message.value.trim();
  if (!subject || !message) return;

  await apiPost('/api/support', { subject, message });
  alert('Support request sent!');
  supportForm.reset();
});
