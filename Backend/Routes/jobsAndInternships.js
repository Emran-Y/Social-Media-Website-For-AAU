const express = require("express");
const authGuard = require("../Middlewares/authGuard");
const {
  postJobAndInternship,
  fetchJobAndInternship,
} = require("../Controllers/jobsAndInternships");
const router = express.Router();

router.route("/post").post(authGuard, postJobAndInternship);
router.route("/").get(authGuard, fetchJobAndInternship);

module.exports = router;
