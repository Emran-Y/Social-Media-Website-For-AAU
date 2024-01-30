import React from "react";
import ClubAdminMyClub from "../pages/clubAdminMyClub/ClubAdminMyClub";
import UserMyOwnClub from "../pages/userMyOwnClub/UserMyOwnClub";
function MyClubs() {
  return (
    <div>
      {JSON.parse(localStorage.getItem("userData")).clubAdmin ? (
        <ClubAdminMyClub />
      ) : (
        <UserMyOwnClub />
      )}
    </div>
  );
}

export default MyClubs;
