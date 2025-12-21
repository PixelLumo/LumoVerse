const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

exports.registerUser = async (req, res) => {
  const { firstname, lastname, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({ firstname, lastname, email, password: hashedPassword });

    res.status(201).json({ 
      token: generateToken(user._id), 
      user: { id: user._id, firstname: user.firstname, lastname: user.lastname, email: user.email } 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    res.status(200).json({ 
      token: generateToken(user._id), 
      user: { id: user._id, firstname: user.firstname, lastname: user.lastname, email: user.email } 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
