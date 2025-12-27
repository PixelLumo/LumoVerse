// User model for PixelLumo
const db = require('../database/db');

module.exports = {
  // Example: get user by ID
  getById: async (id) => {
    const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [id]);
    return rows[0];
  },
  // Add more user model methods as needed
};
