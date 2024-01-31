const Announcement = require("../Models/announcement");
const Comment = require("../Models/comment");

const postAnnouncement = async (req, res) => {
  if (!req.user.isAdmin)
    return res
      .status(403)
      .json({ message: "You are not allowed to post announcements" });
  if (!req.body.title || !req.body.description)
    return res.status(400).json({ message: "fill all fields" });
  const createdAnnouncemnt = new Announcement({
    description: req.body.description,
    title: req.body.title,
    picture: req.body.picture
      ? req.body.picture
      : "https://www.thermaxglobal.com/wp-content/uploads/2020/05/image-not-found.jpg",
  });

  try {
    const announcementSaved = await createdAnnouncemnt.save();
    res.status(200).json(announcementSaved);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const fetchAllAnnouncement = async (req, res) => {
  try {
    const allAnnouncement = await Announcement.find().sort({ updatedAt: -1 });

    res.status(200).json(allAnnouncement);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const fetchAllComments = async (req, res) => {
  try {
    const comments = await Comment.find({
      announcementId: req.params.announcementId,
    })
      .populate("userId", "-password")
      .sort({ updatedAt: -1 });
    return res.status(200).json(comments);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const deleteAnnouncement = async (req, res) => {
  if (!req.user.isAdmin)
    return res
      .status(403)
      .json({ message: "You are not allowed to delete announcements" });
  try {
    const deletedAnnouncement = await Announcement.findByIdAndDelete(
      req.params.announcementId
    );
    if (!deletedAnnouncement)
      return res.status(404).json({ message: "Announcement not found" });
    return res.status(200).json({ message: "Announcement deleted" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const updateAnnouncement = async (req, res) => {
  if (!req.user.isAdmin) {
    return res
      .status(403)
      .json({ message: "You are not allowed to update announcements" });
  }

  try {
    const updatedAnnouncement = await Announcement.findByIdAndUpdate(
      req.params.announcementId,
      {
        $set: {
          title: req.body.title,
          description: req.body.description,
          picture: req.body.picture,
        },
      },
      { new: true }
    );

    if (!updatedAnnouncement) {
      return res.status(404).json({ message: "Announcement not found" });
    }

    return res.status(200).json(updatedAnnouncement);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports.postAnnouncement = postAnnouncement;
module.exports.fetchAllComments = fetchAllComments;
module.exports.fetchAllAnnouncement = fetchAllAnnouncement;
module.exports.deleteAnnouncement = deleteAnnouncement;
module.exports.updateAnnouncement = updateAnnouncement;
