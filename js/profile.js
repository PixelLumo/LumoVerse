import { supabase } from './supabase.js';

const form = document.querySelector('.settings-form');
if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const displayName = form.displayName.value;
    const email = form.email.value;
    const avatar = form.avatar.value;
    const bio = form.bio.value;
    const privacy = form.privacy.value;

    const user = (await supabase.auth.getUser()).data.user;
    if (!user) return alert('Not logged in');

    const { error } = await supabase.from('profiles').upsert({
      id: user.id,
      display_name: displayName,
      email,
      avatar,
      bio,
      privacy
    });
    if (error) return alert(error.message);
    alert('Profile updated!');
  });
}
