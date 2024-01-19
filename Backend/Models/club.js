const mongoose = require("mongoose");

const clubSchema = new mongoose.Schema({
  clubName: { type: String, required: true },
  admin: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  latestMessage: { type: mongoose.Schema.Types.ObjectId, ref: "Message" },
});

const Club = mongoose.model("Club", clubSchema);

module.exports = Club;
