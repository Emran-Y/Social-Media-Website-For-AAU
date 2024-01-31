const express = require("express");
const authGuard = require("../Middlewares/authGuard");
const {
  postJobAndInternship,
  fetchJobAndInternship,
  deleteJobAndInternship,
  updateJobAndInternship,
} = require("../Controllers/jobsAndInternships");
const router = express.Router();

router.route("/post").post(authGuard, postJobAndInternship);
router.route("/").get(authGuard, fetchJobAndInternship);
router.route("/delete/:id").delete(authGuard, deleteJobAndInternship);
router.route("/update/:id").put(authGuard, updateJobAndInternship);

module.exports = router;
