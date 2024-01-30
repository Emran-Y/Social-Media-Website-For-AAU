import React from "react";
import ClubAdminPendings from "../pages/clubAdminPendings/ClubAdminPendings";
import UserClubs from "../pages/userClubs/UserClubs";

function Clubs() {
  return (
    <div>
      {JSON.parse(localStorage.getItem("userData")).clubAdmin ? (
        <ClubAdminPendings />
      ) : (
        <UserClubs />
      )}
    </div>
  );
}

export default Clubs;
