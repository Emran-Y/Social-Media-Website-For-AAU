const express = require("express");
const router = express.Router();
const authGuard = require("../Middlewares/authGuard");
const {
  fetchAllClubs,
  pendingClubRequests,
  myClubs,
  fetchAllPendingClubRequests,
  sendClubJoinRequest,
  acceptClubJoinRequest,
  myOwnClub,
} = require("../Controllers/clubController");

router.route("/allClubs").get(authGuard, fetchAllClubs);
router.route("/pendingClubRequests").get(authGuard, pendingClubRequests);
router.route("/myClubs").get(authGuard, myClubs);
router
  .route("/fetchAllPendingClubRequests")
  .get(authGuard, fetchAllPendingClubRequests);

router.route("/myOwnClub").get(authGuard, myOwnClub);
router.route("/sendClubJoinRequest/:id").get(authGuard, sendClubJoinRequest);
router
  .route("/acceptClubJoinRequest/:id")
  .get(authGuard, acceptClubJoinRequest);

module.exports = router;
