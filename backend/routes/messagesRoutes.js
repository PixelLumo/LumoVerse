const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const Conversation = require('../models/Conversation');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

// Middleware to protect routes
const authMiddleware = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
    req.userId = decoded.id;
    next();
  } catch (error) {
    console.error(error.message);
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// GET /api/messages/conversations?page=1 → List conversations
router.get('/conversations', authMiddleware, async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 20;
  const skip = (page - 1) * limit;

  try {
    const conversations = await Conversation.find({ participants: req.userId })
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('participants', 'firstName lastName avatar');
    res.json(conversations);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// GET /api/messages/conversations/:id → Get messages in a conversation
router.get('/conversations/:id', authMiddleware, async (req, res) => {
  try {
    const conversation = await Conversation.findById(req.params.id);
    if (!conversation || !conversation.participants.includes(req.userId)) return res.status(403).json({ message: 'Unauthorized' });

    const messages = await Message.find({ conversation: req.params.id }).sort({ createdAt: 1 }).populate('sender', 'firstName lastName avatar');
    res.json(messages);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// POST /api/messages/conversations → Start conversation
router.post('/conversations', authMiddleware, [body('userId').notEmpty()], async (req, res) => {
  try {
    let conversation = await Conversation.findOne({
      participants: { $all: [req.userId, req.body.userId] },
    });

    if (!conversation) {
      conversation = new Conversation({ participants: [req.userId, req.body.userId] });
      await conversation.save();
    }

    res.json(conversation);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// POST /api/messages/conversations/:id → Send message
router.post('/conversations/:id', authMiddleware, [body('message').notEmpty()], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const conversation = await Conversation.findById(req.params.id);
    if (!conversation || !conversation.participants.includes(req.userId)) return res.status(403).json({ message: 'Unauthorized' });

    const message = new Message({
      conversation: req.params.id,
      sender: req.userId,
      text: req.body.message,
    });

    await message.save();
    conversation.updatedAt = new Date();
    await conversation.save();

    res.json(message);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
