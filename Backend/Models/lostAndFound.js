const mongoose = require("mongoose");

const lostAndFoundSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    picture: {
      type: String,
      required: false,
      default:
        "https://www.thermaxglobal.com/wp-content/uploads/2020/05/image-not-found.jpg",
    },
  },
  { timestamps: true }
);

const LostAndFound = mongoose.model("LostAndFound", lostAndFoundSchema);

module.exports = LostAndFound;
