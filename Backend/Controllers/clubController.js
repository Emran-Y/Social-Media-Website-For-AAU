const Club = require("../Models/club");
const { User } = require("../Models/user");

// for user, fetch all clubs which user is not a member of
const fetchAllClubs = async (req, res) => {
  if (req.user.clubAdmin) {
    return res.status(403).json("You are not allowed to view all clubs.");
  }
  try {
    const clubs = await Club.find({ users: { $nin: [req.user._id] } }).select(
      "-users -admin -latestMessage -__v"
    );
    res.status(200).json(clubs);
  } catch (err) {
    res.status(500).json(err);
  }
};

// For user, get All clubs which he sent request to join
const pendingClubRequests = async (req, res) => {
  if (req.user.clubAdmin) {
    return res
      .status(403)
      .json("You are not allowed to view pending club requests.");
  }
  try {
    const user = await User.findById(req.user._id)
      .populate("pendingClubRequests")
      .select("-password");
    res.status(200).json(user.pendingClubRequests);
  } catch (err) {
    res.status(500).json(err);
  }
};

// for Admin, fetch all user who has sent request to join his club
const fetchAllPendingClubRequests = async (req, res) => {
  if (!req.user.clubAdmin) {
    return res
      .status(403)
      .json("You are not allowed to view pending club requests.");
  }
  try {
    const allUsers = await User.find({
      pendingClubRequests: { $in: [req.user.clubAdmin] },
    }).select("fullName username email fieldOfStudy _id");
    res.status(200).json(allUsers);
  } catch (err) {
    res.status(500).json(err);
  }
};

// For user , user get all clubs which he is a member of
const myClubs = async (req, res) => {
  if (req.user.clubAdmin)
    return res.status(403).json("You are not allowed to view your clubs.");
  try {
    const myClubs = await Club.find({
      users: { $in: [req.user._id] },
    }).populate(
      "users admin",
      "fullName username email fieldOfStudy profilePicture _id clubAdmin"
    );
    res.status(200).json(myClubs);
  } catch (err) {
    res.status(500).json(err);
  }
};

// for admin, get a club which he is admin of
const myOwnClub = async (req, res) => {
  if (!req.user.clubAdmin)
    return res.status(403).json("You are not allowed to view your club.");
  try {
    const club = await Club.findById(req.user.clubAdmin).populate("users");
    res.status(200).json(club);
  } catch (err) {
    res.status(500).json(err);
  }
};

// for user , send request to join a club
const sendClubJoinRequest = async (req, res) => {
  if (req.user.clubAdmin)
    return res
      .status(403)
      .json("You are not allowed to send club join requests.");
  try {
    const club = await Club.findById(req.params.id);
    if (club.users.includes(req.user._id)) {
      return res.status(403).json("You are already a member of this club.");
    }
    const user = await User.findById(req.user._id);
    if (user.pendingClubRequests.includes(club._id)) {
      return res
        .status(403)
        .json("You have already sent a request to join this club.");
    }
    user.pendingClubRequests.push(club._id);
    await user.save();
    res.status(200).json("Request sent successfully.");
  } catch (err) {
    res.status(500).json(err);
  }
};

// for admin , accept a request to join his club
const acceptClubJoinRequest = async (req, res) => {
  if (!req.user.clubAdmin)
    return res
      .status(403)
      .json("You are not allowed to accept club join requests.");
  try {
    const user = await User.findById(req.params.id);
    const club = await Club.findById(req.user.clubAdmin);
    if (!user.pendingClubRequests.includes(club._id))
      return res
        .status(403)
        .json("This user has not sent a request to join your club.");
    user.pendingClubRequests = user.pendingClubRequests.filter(
      (item) => item.toString() !== club._id.toString()
    );
    user.clubMemberships.push(club._id);
    club.users.push(user._id);
    await user.save();
    await club.save();
    res.status(200).json("Request accepted successfully.");
  } catch (err) {
    res.status(500).json(err);
  }
};

module.exports.fetchAllClubs = fetchAllClubs;
module.exports.pendingClubRequests = pendingClubRequests;
module.exports.myClubs = myClubs;
module.exports.myOwnClub = myOwnClub;
module.exports.sendClubJoinRequest = sendClubJoinRequest;
module.exports.acceptClubJoinRequest = acceptClubJoinRequest;
module.exports.fetchAllPendingClubRequests = fetchAllPendingClubRequests;
