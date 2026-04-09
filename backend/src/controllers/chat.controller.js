const Chat = require("../models/chat.model");

exports.getOrCreateChat = async (req, res) => {
  try {
    const { providerId } = req.params;
    const userId = req.user.id;
    let chat = await Chat.findOne({ participants: { $all: [userId, providerId] } })
      .populate("participants", "name role")
      .populate("messages.sender", "name");
    if (!chat) {
      chat = await Chat.create({ participants: [userId, providerId], messages: [] });
      await chat.populate("participants", "name role");
    }
    res.json(chat);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getMyChats = async (req, res) => {
  try {
    const chats = await Chat.find({ participants: req.user.id })
      .populate("participants", "name role")
      .populate("messages.sender", "name")
      .sort({ updatedAt: -1 });
    res.json(chats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
