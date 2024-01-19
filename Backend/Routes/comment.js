const express = require("express");
const router = express.Router();
const { postComment } = require("../Controllers/commentController");
const authGuard = require("../Middlewares/authGuard");

router.route("/post").post(authGuard, postComment);

module.exports = router;
