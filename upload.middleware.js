import multer from "multer";
import path from "path";

const allowed = ["image/png", "image/jpeg", "image/webp"];

export const upload = multer({
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter(req, file, cb) {
    if (!allowed.includes(file.mimetype))
      return cb(new Error("Invalid file type"));
    cb(null, true);
  },
  storage: multer.diskStorage({
    destination: "uploads/",
    filename: (_, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname));
    }
  })
});
