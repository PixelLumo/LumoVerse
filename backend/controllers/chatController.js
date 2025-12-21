const Message = require('../models/Message');
const Chat = require('../models/Chat');

exports.getMessages = async (req, res) => {
  const { roomId, page = 1 } = req.query;
  const limit = 20;
  const skip = (page - 1) * limit;

  try {
    const messages = await Message.find({ room: roomId }).sort({ createdAt: -1 }).skip(skip).limit(limit);
    res.status(200).json(messages.reverse());
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

exports.sendMessage = async (req, res) => {
  const { roomId, message } = req.body;

  try {
    const newMessage = await Message.create({ room: roomId, sender: req.user.id, message });
    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

exports.getRooms = async (req, res) => {
  try {
    const rooms = await Chat.find();
    res.status(200).json(rooms);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
