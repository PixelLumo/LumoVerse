import { apiGet } from './auth-service.js';

const tutorialsSection = document.getElementById('tutorialList');

async function loadTutorials() {
  const tutorials = await apiGet('/api/tutorials');
  tutorialsSection.innerHTML = '';
  tutorials.forEach(t => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.innerHTML = `
      <h3>${t.title}</h3>
      <p>${t.excerpt}</p>
      <a href="/pages/tutorials.html?id=${t.id}" class="btn-secondary">View</a>
    `;
    tutorialsSection.appendChild(card);
  });
}

loadTutorials();
