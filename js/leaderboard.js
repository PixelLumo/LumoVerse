import { apiGet } from './auth-service.js';

const leaderboardTable = document.getElementById('leaderboardTable');

async function loadLeaderboard() {
  const data = await apiGet('/api/leaderboard');
  leaderboardTable.innerHTML = '';
  data.forEach((user, index) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${index + 1}</td>
      <td>${user.name}</td>
      <td>${user.score}</td>
    `;
    leaderboardTable.appendChild(tr);
  });
}

loadLeaderboard();
