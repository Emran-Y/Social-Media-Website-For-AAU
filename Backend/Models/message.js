const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    content: { type: String, required: true, trim: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    clubId: { type: mongoose.Schema.Types.ObjectId, ref: "Club" },
  },
  { timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
