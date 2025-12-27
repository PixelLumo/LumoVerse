import { apiGet, apiPost } from './auth-service.js';

const profileForm = document.getElementById('profileForm');
const firstnameInput = document.getElementById('firstname');
const lastnameInput = document.getElementById('lastname');
const emailInput = document.getElementById('email');

async function loadProfile() {
  const user = await apiGet('/api/users/me');
  firstnameInput.value = user.firstname;
  lastnameInput.value = user.lastname;
  emailInput.value = user.email;
}

profileForm.addEventListener('submit', async e => {
  e.preventDefault();
  await apiPost('/api/users/me', {
    firstname: firstnameInput.value,
    lastname: lastnameInput.value
  });
  alert('Profile updated!');
});

loadProfile();
