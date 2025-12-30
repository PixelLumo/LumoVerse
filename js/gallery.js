import { supabase } from './supabase.js';

const form = document.getElementById('gallery-upload-form');
const grid = document.getElementById('galleryGrid');

async function loadGallery() {
  const { data, error } = await supabase.from('gallery').select('*').order('created_at', { ascending: false });
  if (error) return console.error(error);
  grid.innerHTML = '';
  data.forEach(item => {
    const div = document.createElement('div');
    div.innerHTML = `
      <img src="${item.file_url}" alt="${item.title}" style="width:100%; border-radius:8px;">
      <h4>${item.title}</h4>
      <p>${item.game}</p>
      <p>${item.description}</p>
    `;
    grid.appendChild(div);
  });
}


if (form) {
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const file = form.file.files[0];
    const title = form.title.value;
    const game = form.game.value;
    const description = form.description.value;

    if (!file) return alert('Select a file');

    // Get user and tier
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return alert('Login required');
    const { data: profile } = await supabase.from('profiles').select('tier').eq('user_id', user.id).single();
    const tier = profile?.tier || 'free';
    const limits = { free: 2, supporter: 5, vip: 20, creator: 9999 };

    // Count uploads today
    const since = new Date();
    since.setHours(0, 0, 0, 0);
    const { count } = await supabase.from('gallery')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .gte('created_at', since.toISOString());
    if (count >= limits[tier]) {
      alert('Upgrade to upload more');
      return;
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const { data: fileData, error: uploadError } = await supabase.storage.from('gallery').upload(fileName, file);
    if (uploadError) return alert(uploadError.message);

    const { publicURL } = supabase.storage.from('gallery').getPublicUrl(fileName);
    const { error } = await supabase.from('gallery').insert([{ title, game, description, file_url: publicURL, user_id: user.id }]);
    if (error) return alert(error.message);
    form.reset();
    loadGallery();
  });
}

loadGallery();
