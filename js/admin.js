import { apiGet, apiPost, apiDelete } from './auth-service.js';

const usersTable = document.getElementById('usersTable');

async function loadUsers() {
  const users = await apiGet('/api/admin/users');
  usersTable.innerHTML = '';
  users.forEach(u => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${u.firstname} ${u.lastname}</td>
      <td>${u.email}</td>
      <td>${u.role}</td>
      <td>
        <button class="btn-secondary" data-id="${u.id}" onclick="deleteUser(this)">Delete</button>
      </td>
    `;
    usersTable.appendChild(tr);
  });
}

window.deleteUser = async (btn) => {
  const id = btn.dataset.id;
  if (confirm('Are you sure you want to delete this user?')) {
    await apiDelete(`/api/admin/users/${id}`);
    loadUsers();
  }
};

loadUsers();
