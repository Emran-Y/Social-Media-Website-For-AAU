const Comment = require("../Models/comment");
const User = require("../Models/user"); // Assuming you have a User model
const Announcement = require("../Models/announcement"); // Assuming you have an Announcement model

const postComment = async (req, res) => {
  if (!req.body.announcementId || !req.body.content) {
    return res.status(400).json({ message: "Fill all fields" });
  }

  try {
    const commentCreated = new Comment({
      content: req.body.content,
      userId: req.user._id,
      announcementId: req.body.announcementId,
    });

    const commentSaved = await commentCreated.save();

    return res
      .status(200)
      .json(
        await Comment.findById(commentSaved._id)
          .populate("userId")
          .populate("announcementId")
      );
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports.postComment = postComment;
