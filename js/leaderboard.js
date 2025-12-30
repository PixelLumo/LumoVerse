// leaderboard.js - Auto-update leaderboard with add links for demo
import { supabase } from './supabase.js';

const table = document.getElementById('leaderboardTable');

async function loadLeaderboard() {
  const { data, error } = await supabase.from('leaderboard').select('*').order('score', { ascending: false });
  if (error) return console.error(error);
  table.innerHTML = '';
  data.forEach((player, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `<td>${index + 1}</td><td>${player.name}</td><td>${player.score}</td>`;
    table.appendChild(row);
  });
}


loadLeaderboard();

// Referral leaderboard
const referralTable = document.getElementById('referralLeaderboardTable');
async function loadReferralLeaderboard() {
  const { data, error } = await supabase
    .from('profiles')
    .select('display_name, referral_count')
    .order('referral_count', { ascending: false })
    .limit(10);
  if (error) return console.error(error);
  referralTable.innerHTML = '';
  data.forEach((user, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `<td>${index + 1}</td><td>${user.display_name || 'Anonymous'}</td><td>${user.referral_count || 0}</td>`;
    referralTable.appendChild(row);
  });
}
loadReferralLeaderboard();
