const Message = require("../Models/message");

const sendMessage = async (req, res) => {
  if (!req.body.content || !req.body.clubId) {
    return res.status(400).json("Missing data");
  }
  const newMessage = new Message({
    content: req.body.content,
    sender: req.user._id,
    clubId: req.body.clubId,
  });
  try {
    const savedMessage = await newMessage.save();
    const populatedMessage = await savedMessage.populate("sender", "-password");
    return res.status(200).json(populatedMessage);
  } catch (err) {
    return res.status(500).json(err);
  }
};

const fetchAllMessages = async (req, res) => {
  try {
    const messages = await Message.find({ clubId: req.params.id })
      .sort({ updatedAt: 1 })
      .populate("sender", "fullName profilePicture _id username")
      .populate("clubId", "clubName _id admin");
    return res.status(200).json(messages);
  } catch (err) {
    return res.status(500).json(err);
  }
};

module.exports.fetchAllMessages = fetchAllMessages;
module.exports.sendMessage = sendMessage;
