import express from "express";
import { requireAuth } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/upload.middleware.js";

const router = express.Router();

router.post("/", requireAuth, upload.single("file"), (req, res) => {
	res.json({ path: `/uploads/${req.file.filename}` });
});

export default router;
