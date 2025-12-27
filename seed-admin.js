import { db } from "./database.js";
import { hashPassword } from "../utils/password.js";

const run = async () => {
	const password = await hashPassword("ChangeMeNow123!");
	await db.execute(
		"INSERT INTO users (username,email,password,role,email_verified) VALUES (?,?,?,?,true)",
		["admin", "admin@lumoverse.com", password, "admin"]
	);
	console.log("Admin created");
	process.exit();
};

run();
