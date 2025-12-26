
export async function requestPasswordReset(req, res) {
	const { email } = req.body;
	const token = uuid();
	const expires = new Date(Date.now() + 1000 * 60 * 30); // 30 min

	await db.execute(
		"UPDATE users SET reset_token=?, reset_expires=? WHERE email=?",
		[token, expires, email]
	);

	await mailer.sendMail({
		to: email,
		subject: "Reset your LumoVerse password",
		html: `<a href="${process.env.BASE_URL}/reset-password.html?token=${token}">Reset Password</a>`
	});

	res.json({ success: true });
}

export async function resetPassword(req, res) {
	const { token, password } = req.body;
	const hashed = await hashPassword(password);

	const [result] = await db.execute(
		`UPDATE users
		 SET password=?, reset_token=NULL, reset_expires=NULL
		 WHERE reset_token=? AND reset_expires > NOW()`,
		[hashed, token]
	);

	if (result.affectedRows === 0)
		return res.status(400).json({ error: "Invalid or expired token" });

	res.json({ success: true });
}
import { db } from "../database.js";
import { hashPassword, verifyPassword } from "../utils/password.js";
import { v4 as uuid } from "uuid";
import { mailer } from "../services/email.service.js";

export async function signup(req, res) {
	const { username, email, password } = req.body;
	const verifyToken = uuid();
	const hashed = await hashPassword(password);

	await db.execute(
		"INSERT INTO users (username,email,password,verify_token) VALUES (?,?,?,?)",
		[username, email, hashed, verifyToken]
	);

	await mailer.sendMail({
		to: email,
		subject: "Verify your LumoVerse account",
		html: `<a href="${process.env.BASE_URL}/api/auth/verify/${verifyToken}">Verify</a>`
	});

	res.json({ success: true });
}

export async function login(req, res) {
	const { email, password } = req.body;
	const [[user]] = await db.execute("SELECT * FROM users WHERE email = ?", [email]);

	if (!user || !await verifyPassword(password, user.password))
		return res.status(401).json({ error: "Invalid credentials" });

	if (!user.email_verified)
		return res.status(403).json({ error: "Email not verified" });

	req.session.user = { id: user.id, role: user.role };
	res.json({ success: true });
}
