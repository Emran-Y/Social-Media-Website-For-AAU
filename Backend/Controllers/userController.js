const { userValidator, User } = require("../Models/user");
const bcrypt = require("bcrypt");
const AAUDB = require("../aauDb");
const _ = require("lodash");
const jwt = require("jsonwebtoken");
const Comment = require("../Models/comment");
const Announcement = require("../Models/announcement");

/**
 * @swagger
 * /api/user/login:
 *   post:
 *     summary: Login a user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: The user's username
 *                 example: "john_doe"
 *               password:
 *                 type: string
 *                 description: The user's password
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: Successful login
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: The user's ID
 *                   example: "60c72b2f5f1b2c001c8e4d9a"
 *                 token:
 *                   type: string
 *                   description: The user's JWT token
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                 isAdmin:
 *                   type: boolean
 *                   description: Whether the user is an admin
 *                   example: false
 *                 fullName:
 *                   type: string
 *                   description: The user's full name
 *                   example: "John Doe"
 *                 username:
 *                   type: string
 *                   description: The user's username
 *                   example: "john_doe"
 *                 clubAdmin:
 *                   type: boolean
 *                   description: Whether the user is a club admin
 *                   example: false
 *                 activities:
 *                   type: array
 *                   description: The user's activities
 *                   items:
 *                     type: string
 *                 fieldOfStudy:
 *                   type: string
 *                   description: The user's field of study
 *                   example: "Computer Science"
 *                 universityId:
 *                   type: string
 *                   description: The user's university ID
 *                   example: "U12345678"
 *                 profilePicture:
 *                   type: string
 *                   description: The user's profile picture URL
 *                   example: "https://example.com/profile.jpg"
 *                 clubMemberships:
 *                   type: array
 *                   description: The user's club memberships
 *                   items:
 *                     type: string
 *                 pendingClubRequests:
 *                   type: array
 *                   description: The user's pending club requests
 *                   items:
 *                     type: string
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *                   example: "username or password incorrect"
 */

const loginUser = async (req, res) => {
  if (!req.body.username || !req.body.password)
    return res
      .status(400)
      .json({ message: "please consider filling all datas" });
  const userExist = await User.findOne({ username: req.body.username });
  if (!userExist)
    return res.status(400).json({ message: "username or password incorrect" });

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
        "isAdmin",
        "fullName",
        "username",
        "clubAdmin",
        "activities",
        "fieldOfStudy",
        "universityId",
        "profilePicture",
        "clubMemberships",
        "pendingClubRequests",
        "clubAdmin",
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
    ...(req.body.profilePicture && { profilePicture: req.body.profilePicture }),
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
          "isAdmin",
          "fullName",
          "username",
          "clubAdmin",
          "activities",
          "fieldOfStudy",
          "universityId",
          "profilePicture",
          "clubMemberships",
          "pendingClubRequests",
          "clubAdmin",
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

    const hasLiked = user.activities.likes.includes(req.params.announcementId);

    if (hasLiked) {
      // Unlike the announcement
      user.activities.likes = user.activities.likes.filter(
        (like) => like.toString() !== req.params.announcementId
      );
      announcement.likes = announcement.likes.filter(
        (like) => like.toString() !== req.user._id
      );
    } else {
      // Like the announcement
      user.activities.likes.push(req.params.announcementId);
      announcement.likes.push(req.user._id);
    }

    // Save changes to the database
    await user.save();
    await announcement.save();

    // Respond with the updated announcement
    res.status(200).json(announcement);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const editProfile = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        $set: {
          fullName: req.body.fullName,
          fieldOfStudy: req.body.fieldOfStudy,
          profilePicture: req.body.profilePicture,
        },
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    updatedUser.token = jwt.sign(
      { userId: updatedUser._id },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "30d" }
    );

    res
      .status(200)
      .json(
        _.pick(updatedUser, [
          "_id",
          "token",
          "isAdmin",
          "fullName",
          "username",
          "clubAdmin",
          "activities",
          "fieldOfStudy",
          "universityId",
          "profilePicture",
          "clubMemberships",
          "pendingClubRequests",
          "clubAdmin",
        ])
      );
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports.loginUser = loginUser;
module.exports.registerUser = registerUser;
module.exports.fetchLikes = fetchLikes;
module.exports.fetchComments = fetchComments;
module.exports.fetchUser = fetchUser;
module.exports.likeAnnouncement = likeAnnouncement;
module.exports.editProfile = editProfile;
