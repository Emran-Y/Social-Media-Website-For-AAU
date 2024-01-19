const express = require("express");
const router = express.Router();
const Club = require("../Models/club");

router.get("/", async (req, res) => {
  res.json("This is the club route");
});

module.exports = router;
