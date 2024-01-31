const express = require("express");
const authGuard = require("../Middlewares/authGuard");
const router = express.Router();
const {
  postLostAndFound,
  fetchLostAndFound,
  updateLostAndFound,
  deleteLostAndFound,
} = require("../Controllers/lostAndFoundController");

router.route("/post").post(authGuard, postLostAndFound);
router.route("/").get(authGuard, fetchLostAndFound);
router.route("/update/:id").put(authGuard, updateLostAndFound);
router.route("/delete/:id").delete(authGuard, deleteLostAndFound);

module.exports = router;
