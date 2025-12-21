const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Blog = require('../models/Blog');
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

// GET /api/blog?page=1 → List all posts paginated
router.get('/', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 10;
  const skip = (page - 1) * limit;

  try {
    const posts = await Blog.find().sort({ createdAt: -1 }).skip(skip).limit(limit).populate('author', 'firstName lastName');
    res.json(posts);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// GET /api/blog/:id → Get single post
router.get('/:id', async (req, res) => {
  try {
    const post = await Blog.findById(req.params.id).populate('author', 'firstName lastName');
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json(post);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// POST /api/blog → Create post
router.post(
  '/',
  authMiddleware,
  [body('title').notEmpty(), body('content').notEmpty()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const newPost = new Blog({
        ...req.body,
        author: req.userId,
      });
      await newPost.save();
      res.json({ message: 'Post created', post: newPost });
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Server error');
    }
  }
);

// PUT /api/blog/:id → Update post
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const post = await Blog.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (post.author.toString() !== req.userId) return res.status(403).json({ message: 'Unauthorized' });

    Object.assign(post, req.body);
    await post.save();
    res.json({ message: 'Post updated', post });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// DELETE /api/blog/:id → Delete post
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const post = await Blog.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (post.author.toString() !== req.userId) return res.status(403).json({ message: 'Unauthorized' });

    await post.remove();
    res.json({ message: 'Post deleted' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
