const Gallery = require('../models/Gallery');
const fs = require('fs');

exports.getAllArtworks = async (req, res) => {
  try {
    const artworks = await Gallery.find();
    res.status(200).json(artworks);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

exports.getArtwork = async (req, res) => {
  try {
    const artwork = await Gallery.findById(req.params.id);
    if (!artwork) return res.status(404).json({ message: 'Artwork not found' });
    res.status(200).json(artwork);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

exports.uploadArtwork = async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ message: 'No file uploaded' });

    const artwork = await Gallery.create({ 
      filename: file.filename,
      path: file.path,
      uploadedBy: req.user.id,
    });

    res.status(201).json(artwork);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

exports.likeArtwork = async (req, res) => {
  try {
    const artwork = await Gallery.findById(req.params.id);
    if (!artwork) return res.status(404).json({ message: 'Artwork not found' });

    artwork.likes = (artwork.likes || 0) + 1;
    await artwork.save();
    res.status(200).json(artwork);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

exports.commentArtwork = async (req, res) => {
  try {
    const artwork = await Gallery.findById(req.params.id);
    if (!artwork) return res.status(404).json({ message: 'Artwork not found' });

    const comment = { user: req.user.id, text: req.body.comment };
    artwork.comments.push(comment);
    await artwork.save();
    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
