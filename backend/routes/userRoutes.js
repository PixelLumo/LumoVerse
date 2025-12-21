const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
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

// GET /api/users/:id → Get user profile
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// PUT /api/users/profile → Update current user
router.put(
  '/profile',
  authMiddleware,
  [body('firstName').optional(), body('lastName').optional()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const user = await User.findById(req.userId);
      if (!user) return res.status(404).json({ message: 'User not found' });

      Object.assign(user, req.body);
      await user.save();

      res.json({ message: 'Profile updated', user });
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Server error');
    }
  }
);

// GET /api/users/leaderboard?page=1 → Leaderboard
router.get('/leaderboard', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 10;
  const skip = (page - 1) * limit;

  try {
    const users = await User.find().sort({ points: -1 }).skip(skip).limit(limit).select('firstName lastName points avatar');
    res.json(users);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// GET /api/users/:id/stats → User stats
router.get('/:id/stats', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const stats = {
      creations: user.creationsCount || 0,
      posts: user.postsCount || 0,
      points: user.points || 0,
    };

    res.json(stats);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
