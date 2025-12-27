// leaderboard.js - Auto-update leaderboard with add links for demo

const leaderboardTable = document.getElementById('leaderboardTable');

// Demo data (replace with API calls in production)
let leaderboard = [
  { player: 'LumoGamer', score: 1200 },
  { player: 'PixelPro', score: 950 },
  { player: 'BlockBuilder', score: 800 }
];

function renderLeaderboard() {
  leaderboardTable.innerHTML = '';
  leaderboard.forEach((entry, i) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td style="padding:0.5rem;">${i + 1}</td>
      <td style="padding:0.5rem;">${entry.player}</td>
      <td style="padding:0.5rem;">${entry.score}</td>
    `;
    leaderboardTable.appendChild(tr);
  });
}

// Add player/score links for demo
function addPlayer() {
  const name = prompt('Enter player name:');
  const score = parseInt(prompt('Enter score:'), 10);
  if (name && !isNaN(score)) {
    leaderboard.push({ player: name, score });
    leaderboard.sort((a, b) => b.score - a.score);
    renderLeaderboard();
  }
}

// Add link below leaderboard
const addLink = document.createElement('a');
addLink.href = '#';
addLink.textContent = '+ Add Player/Score';
addLink.style.display = 'inline-block';
addLink.style.margin = '1em 0 0 0';
addLink.style.color = '#e040fb';
addLink.style.fontWeight = 'bold';
addLink.onclick = (e) => {
  e.preventDefault();
  addPlayer();
};
leaderboardTable.parentElement.appendChild(addLink);

// Auto-update every 10 seconds (simulate live updates)
setInterval(renderLeaderboard, 10000);

// Initial render
renderLeaderboard();
