const express = require("express");
const router = express.Router();
const authGuard = require("../Middlewares/authGuard");
const {
  loginUser,
  registerUser,
  fetchLikes,
  fetchComments,
  fetchUser,
  likeAnnouncement,
  editProfile,
} = require("../Controllers/userController");

router.post("/login", loginUser);
router.post("/register", registerUser);
router.route("/editProfile").put(authGuard, editProfile);
router.route("/likes").get(authGuard, fetchLikes);
router.route("/comments").get(authGuard, fetchComments);
router.route("/:userId").get(authGuard, fetchUser);
router.route("/like/:announcementId").get(authGuard, likeAnnouncement);

module.exports = router;
