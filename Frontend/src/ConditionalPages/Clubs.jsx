import React from "react";
import ClubAdminPendings from "../pages/clubAdminPendings/ClubAdminPendings";
import UserClubs from "../pages/userClubs/UserClubs";

function Clubs() {
  return (
    <div>
      <ClubAdminPendings />
      <UserClubs />
    </div>
  );
}

export default Clubs;
