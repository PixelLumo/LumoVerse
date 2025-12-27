// Post model for PixelLumo
const db = require('../database/db');

module.exports = {
  // Example: get post by ID
  getById: async (id) => {
    const [rows] = await db.query('SELECT * FROM posts WHERE id = ?', [id]);
    return rows[0];
  },
  // Add more post model methods as needed
};
