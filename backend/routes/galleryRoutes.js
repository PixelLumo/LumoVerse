const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Gallery = require('../models/Gallery');
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

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// @route   GET /api/gallery
// @desc    Get all artworks (paginated)
// @access  Public
router.get('/', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 10;
  const skip = (page - 1) * limit;

  try {
    const artworks = await Gallery.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('user', 'firstName lastName avatar');

    res.json(artworks);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/gallery/:id
// @desc    Get artwork by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const artwork = await Gallery.findById(req.params.id).populate('user', 'firstName lastName avatar');
    if (!artwork) return res.status(404).json({ message: 'Artwork not found' });

    res.json(artwork);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// @route   POST /api/gallery/upload
// @desc    Upload new artwork
// @access  Private
router.post(
  '/upload',
  authMiddleware,
  upload.single('image'),
  [body('title').notEmpty().withMessage('Title is required')],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { title, description } = req.body;

    try {
      const newArtwork = new Gallery({
        title,
        description,
        imageUrl: `/uploads/${req.file.filename}`,
        user: req.userId,
      });

      await newArtwork.save();
      res.json({ message: 'Artwork uploaded successfully', artwork: newArtwork });
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Server error');
    }
  }
);

// @route   POST /api/gallery/:id/like
// @desc    Like an artwork
// @access  Private
router.post('/:id/like', authMiddleware, async (req, res) => {
  try {
    const artwork = await Gallery.findById(req.params.id);
    if (!artwork) return res.status(404).json({ message: 'Artwork not found' });

    if (!artwork.likes.includes(req.userId)) {
      artwork.likes.push(req.userId);
      await artwork.save();
    }

    res.json({ message: 'Artwork liked', likes: artwork.likes.length });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// @route   POST /api/gallery/:id/comments
// @desc    Comment on an artwork
// @access  Private
router.post(
  '/:id/comments',
  authMiddleware,
  [body('comment').notEmpty().withMessage('Comment cannot be empty')],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const artwork = await Gallery.findById(req.params.id);
      if (!artwork) return res.status(404).json({ message: 'Artwork not found' });

      const comment = {
        user: req.userId,
        text: req.body.comment,
        createdAt: new Date(),
      };

      artwork.comments.push(comment);
      await artwork.save();

      res.json({ message: 'Comment added', comments: artwork.comments });
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Server error');
    }
  }
);

module.exports = router;
