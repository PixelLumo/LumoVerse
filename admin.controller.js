import { db } from "./database.js";
import { logAdminAction } from "../services/admin.service.js";
export async function listUsers(req, res) {
  const [users] = await db.execute(
    "SELECT id, username, email, role, is_active, created_at FROM users"
  );
  res.json(users);
}
  export async function toggleUserStatus(req, res) {
    const { id } = req.params;
    await db.execute(
      "UPDATE users SET is_active = NOT is_active WHERE id=?",
      [id]
    );
    await logAdminAction(req.user.id, "TOGGLE_USER", `user:${id}`);
    res.json({ success: true });
  }

  export async function getAuditLogs(req, res) {
    const [logs] = await db.execute(
      "SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT 100"
    );
    res.json(logs);
  }
export async function getSystemStats(req, res) {
  const [[users]] = await db.execute("SELECT COUNT(*) as count FROM users");
  res.json({ users: users.count });
}
