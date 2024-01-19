const express = require("express");
const router = express.Router();
const {
  postAnnouncement,
  fetchAllComments,
  fetchAllAnnouncement,
} = require("../Controllers/announcementController");
const authGuard = require("../Middlewares/authGuard");

router.route("/").get(authGuard, fetchAllAnnouncement);
router.route("/post").post(authGuard, postAnnouncement);
router.route("/allcomments/:announcementId").get(authGuard, fetchAllComments);

module.exports = router;
