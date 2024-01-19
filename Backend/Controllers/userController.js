const { userValidator, User } = require("../Models/user");
const bcrypt = require("bcrypt");
const AAUDB = require("../aauDb");
const _ = require("lodash");
const jwt = require("jsonwebtoken");
const Comment = require("../Models/comment");
const Announcement = require("../Models/announcement");

const loginUser = async (req, res) => {
  if (!req.body.username || !req.body.password)
    return res
      .status(403)
      .json({ message: "please consider filling all datas" });
  const userExist = await User.findOne({ username: req.body.username });
  if (!userExist)
    return res.status(40).json({ message: "username or password incorrect" });

  const validPassword = await bcrypt.compare(
    req.body.password,
    userExist.password
  );
  if (!validPassword)
    return res.status(400).json({ message: "username or password incorrect" });

  userExist.token = jwt.sign(
    { userId: userExist._id },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: "30d",
    }
  );

  res
    .status(200)
    .json(
      _.pick(userExist, [
        "_id",
        "token",
        "fullName",
        "username",
        "clubAdmin",
        "activities",
        "fieldOfStudy",
        "universityId",
        "profilePicture",
        "clubMemberships",
        "pendingClubRequests",
      ])
    );
};

const registerUser = async (req, res) => {
  let userExist;

  // Validate the user input
  const { error } = userValidator(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  // check for user credentials in AAU DB
  let flag = false;
  AAUDB.forEach((user) => {
    if (req.body.universityId === user.studentId) {
      if (req.body.universityPassword === user.password) {
        flag = true;
        return;
      }
    }
  });

  if (!flag) return res.status(400).json({ message: "Invalid Credentials" });

  // Check if the user already exists in the database (username)
  try {
    userExist = await User.findOne({ username: req.body.username });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }

  if (userExist)
    return res.status(400).json({ message: "User already exists" });

  // Check if the user already exists in the database (AAU ID)

  try {
    userExist = await User.findOne({ universityId: req.body.universityId });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }

  if (userExist)
    return res.status(400).json({ message: "User already exists" });

  // Hash the password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  // Create the new user
  const newUser = new User({
    universityId: req.body.universityId,
    fullName: req.body.fullName,
    fieldOfStudy: req.body.fieldOfStudy,
    username: req.body.username,
    password: hashedPassword,
  });

  // Save the new user to the database
  try {
    const userSaved = await newUser.save();
    userSaved.token = jwt.sign(
      { userId: userSaved._id },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "30d",
      }
    );
    res
      .status(200)
      .json(
        _.pick(userSaved, [
          "_id",
          "token",
          "fullName",
          "username",
          "clubAdmin",
          "activities",
          "fieldOfStudy",
          "universityId",
          "profilePicture",
          "clubMemberships",
          "pendingClubRequests",
        ])
      );
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const fetchLikes = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("activities.likes");
    res.status(200).json(user.activities.likes);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const fetchComments = async (req, res) => {
  try {
    const myComments = await Comment.find({ userId: req.user._id })
      .populate("announcementId")
      .sort({ updatedAt: -1 });
    res.status(200).json(myComments);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const fetchUser = async (req, res) => {
  try {
    const thisUser = await User.findById(req.params.userId).select(
      "fullName profilePicture fieldOfStudy"
    );
    res.status(200).json(thisUser);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const likeAnnouncement = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const announcement = await Announcement.findById(req.params.announcementId);
    if (user.activities.likes.includes(req.params.announcementId)) {
      user.activities.likes = user.activities.likes.filter(
        (like) => like != req.params.announcementId
      );
      announcement.likes = announcement.likes.filter(
        (like) => like != req.user._id
      );
      res.status(200).json(announcement);
    } else {
      user.activities.likes.push(req.params.announcementId);
      announcement.likes.push(req.user._id);
      user.save();
      announcement.save();
      res.status(200).json(announcement);
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports.loginUser = loginUser;
module.exports.registerUser = registerUser;
module.exports.fetchLikes = fetchLikes;
module.exports.fetchComments = fetchComments;
module.exports.fetchUser = fetchUser;
module.exports.likeAnnouncement = likeAnnouncement;
