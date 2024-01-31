const express = require("express");
const router = express.Router();
const {
  postAnnouncement,
  fetchAllComments,
  fetchAllAnnouncement,
  deleteAnnouncement,
  updateAnnouncement,
  fetchAnnouncement,
} = require("../Controllers/announcementController");
const authGuard = require("../Middlewares/authGuard");

router.route("/").get(authGuard, fetchAllAnnouncement);
router.route("/post").post(authGuard, postAnnouncement);
router.route("/allcomments/:announcementId").get(authGuard, fetchAllComments);
router.route("/delete/:announcementId").delete(authGuard, deleteAnnouncement);
router.route("/update/:announcementId").put(authGuard, updateAnnouncement);
router.route("/get/:announcementId").get(authGuard, fetchAnnouncement);

module.exports = router;
