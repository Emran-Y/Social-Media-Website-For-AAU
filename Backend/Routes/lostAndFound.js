const express = require("express");
const authGuard = require("../Middlewares/authGuard");
const router = express.Router();
const {
  postLostAndFound,
  fetchLostAndFound,
} = require("../Controllers/lostAndFoundController");

router.route("/post").post(authGuard, postLostAndFound);
router.route("/").get(authGuard, fetchLostAndFound);

module.exports = router;
