import { apiPost } from './auth-service.js';

const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', async e => {
  e.preventDefault();
  const name = contactForm.name.value.trim();
  const email = contactForm.email.value.trim();
  const message = contactForm.message.value.trim();
  if (!name || !email || !message) return;

  await apiPost('/api/contact', { name, email, message });
  alert('Message sent!');
  contactForm.reset();
});
