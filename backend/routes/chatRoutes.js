const express = require('express');
const router = express.Router();
const { getMessages, sendMessage, getRooms } = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware');

router.get('/rooms', protect, getRooms);
router.get('/messages', protect, getMessages);
router.post('/messages', protect, sendMessage);

module.exports = router;
