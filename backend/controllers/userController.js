const User = require('../models/User');

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const { firstname, lastname } = req.body;
    user.firstname = firstname || user.firstname;
    user.lastname = lastname || user.lastname;

    await user.save();
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

exports.getLeaderboard = async (req, res) => {
  try {
    const topUsers = await User.find().sort({ points: -1 }).limit(10).select('firstname lastname points');
    res.status(200).json(topUsers);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

exports.getStats = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('firstname lastname points achievements');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
