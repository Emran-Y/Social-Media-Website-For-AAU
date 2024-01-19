const express = require("express");
const authGuard = require("../Middlewares/authGuard");
const router = express.Router();
const {
  fetchAllMessages,
  sendMessage,
} = require("../Controllers/messageController");

router.route("/sendMessage").post(authGuard, sendMessage);
router.route("/fetchAllMessages/:id").get(authGuard, fetchAllMessages);

module.exports = router;
