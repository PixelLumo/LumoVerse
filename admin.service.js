import { db } from "../database.js";

export async function logAdminAction(adminId, action, target) {
	await db.execute(
		"INSERT INTO audit_logs (admin_id, action, target) VALUES (?,?,?)",
		[adminId, action, target]
	);
}
