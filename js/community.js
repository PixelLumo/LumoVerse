import { supabase } from './supabase.js';

const feed = document.getElementById('communityFeed');

async function loadCommunity() {
  const { data, error } = await supabase.from('community').select('*').order('created_at', { ascending: false });
  if (error) return console.error(error);
  feed.innerHTML = '';
  data.forEach(post => {
    const div = document.createElement('div');
    div.innerHTML = `<h4>${post.title}</h4><p>${post.content}</p>`;
    feed.appendChild(div);
  });
}

loadCommunity();
