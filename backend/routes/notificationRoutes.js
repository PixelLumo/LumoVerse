const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
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

// GET /api/notifications?page=1 → List notifications
router.get('/', authMiddleware, async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 20;
  const skip = (page - 1) * limit;

  try {
    const notifications = await Notification.find({ user: req.userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    res.json(notifications);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// POST /api/notifications/:id/read → Mark as read
router.post('/:id/read', authMiddleware, async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) return res.status(404).json({ message: 'Notification not found' });
    if (notification.user.toString() !== req.userId) return res.status(403).json({ message: 'Unauthorized' });

    notification.read = true;
    await notification.save();
    res.json({ message: 'Notification marked as read' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// POST /api/notifications/read-all → Mark all as read
router.post('/read-all', authMiddleware, async (req, res) => {
  try {
    await Notification.updateMany({ user: req.userId, read: false }, { read: true });
    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// DELETE /api/notifications/:id → Delete notification
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) return res.status(404).json({ message: 'Notification not found' });
    if (notification.user.toString() !== req.userId) return res.status(403).json({ message: 'Unauthorized' });

    await notification.remove();
    res.json({ message: 'Notification deleted' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
