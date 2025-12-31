const supabase = supabase.createClient(
  "YOUR_SUPABASE_URL",
  "YOUR_PUBLIC_ANON_KEY"
);

async function requireAdmin() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) location.href = "login.html";

  const { data } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("user_id", user.id)
    .single();

  if (!data?.is_admin) location.href = "start.html";



  requireAdmin();

  // ADMIN ANALYTICS DASHBOARD
  async function loadStats() {
    const [users, online, messages, gallery] = await Promise.all([
      supabase.from("profiles").select("*", { count: "exact", head: true }),
      supabase.from("online_users").select("*", { count: "exact", head: true }),
      supabase.from("messages").select("*", { count: "exact", head: true }),
      supabase.from("gallery").select("*", { count: "exact", head: true })
    ]);
    document.getElementById("statUsers").textContent = users.count;
    document.getElementById("statOnline").textContent = online.count;
    document.getElementById("statMessages").textContent = messages.count;
    document.getElementById("statGallery").textContent = gallery.count;
  }
  loadStats();
  setInterval(loadStats, 15000);

  // ONLINE USERS
  async function loadOnlineUsers() {
    const { data } = await supabase
      .from("online_users")
      .select("user_id, last_seen");
    const el = document.getElementById("onlineUsers");
    el.innerHTML = `<table><tr><th>User</th><th>Last Seen</th><th>Status</th></tr>` +
      data.map(u => `
      <tr>
        <td>${u.user_id}</td>
        <td>${new Date(u.last_seen).toLocaleTimeString()}</td>
        <td><span class="admin-tag online">ONLINE</span></td>
      </tr>
    `).join("") + `</table>`;
  }
  loadOnlineUsers();
  setInterval(loadOnlineUsers, 10000);

  // USERS
  async function loadUsers() {
    const { data } = await supabase.from("profiles").select("id, display_name, email, role, tier, banned, last_seen, referral_count");
    const table = document.getElementById("usersTable");
    table.innerHTML = `<tr><th>Name</th><th>Role</th><th>Banned</th><th>Online</th><th>Referrals</th><th>Actions</th></tr>`;
    data.forEach(u => {
      const online = Date.now() - new Date(u.last_seen).getTime() < 60000;
      table.innerHTML += `
      <tr>
        <td>${u.display_name || u.email}</td>
        <td>${u.role}</td>
        <td>${u.banned ? "🚫" : "✅"}</td>
        <td>${online ? '<span class="admin-tag online">ONLINE</span>' : ''}</td>
        <td>${u.referral_count || 0}</td>
        <td>
          <button onclick="ban('${u.id}')">Ban</button>
          <button onclick="promote('${u.id}')">Promote</button>
        </td>
      </tr>
    `;
    });
  }

  // Ban user
  async function ban(id) {
    await supabase.from("profiles").update({ banned: true }).eq("id", id);
    loadUsers();
  }

  // Promote user to admin
  async function promote(id) {
    await supabase.from("profiles").update({ role: "admin" }).eq("id", id);
    loadUsers();
  }

  // Load reports
  async function loadReports() {
    const { data } = await supabase.from("reports").select("*");
    const el = document.getElementById("reports");
    el.innerHTML = `<table style='width:100%;color:white;'><tr><th>Reporter</th><th>Target</th><th>Reason</th><th>Date</th></tr>` +
      data.map(r => `
      <tr>
        <td>${r.reporter}</td>
        <td>${r.target}</td>
        <td>${r.reason}</td>
        <td>${new Date(r.created_at).toLocaleString()}</td>
      </tr>
    `).join("") + `</table>`;
  }
}

// Change user tier
async function setTier(userId, tier) {
  await supabase
    .from("profiles")
    .update({ tier })
    .eq("user_id", userId);
  alert("Tier updated");
  loadUsers();
}

// Change user role
async function setRole(userId, role) {
  await supabase
    .from("profiles")
    .update({ role })
    .eq("user_id", userId);
  alert("Role updated");
  loadUsers();
}

// MESSAGES
async function loadMessages() {
  const { data } = await supabase.from("messages").select("*");
  const el = document.getElementById("messages");
  el.innerHTML = `<table><tr><th>User</th><th>Message</th><th>Action</th></tr>` +
    data.map(m => `
      <tr>
        <td>${m.user_id}</td>
        <td>${m.content}</td>
        <td><button onclick="deleteMessage('${m.id}')">Delete</button></td>
      </tr>
    `).join("") + `</table>`;
}

async function deleteMessage(id) {
  await supabase.from("messages").delete().eq("id", id);
  loadMessages();
}

// GALLERY
async function loadGallery() {
  const { data } = await supabase.from("gallery").select("*");
  const el = document.getElementById("gallery");
  el.innerHTML = `<table><tr><th>Title</th><th>Uploader</th><th>Action</th></tr>` +
    data.map(g => `
      <tr>
        <td>${g.title}</td>
        <td>${g.user_id || ''}</td>
        <td><button onclick="deleteGallery('${g.id}')">Delete</button></td>
      </tr>
    `).join("") + `</table>`;
}

async function deleteGallery(id) {
  await supabase.from("gallery").delete().eq("id", id);
  loadGallery();
}

// SEARCH / FILTER
function filterTable() {
  const q = document.getElementById("searchInput").value.toLowerCase();
  document.querySelectorAll("table tr").forEach(row => {
    row.style.display = row.innerText.toLowerCase().includes(q)
      ? ""
      : "none";
  });
}
document.getElementById("searchInput").addEventListener("input", filterTable);

loadUsers();
loadMessages();
loadGallery();
