import React from "react";
import ClubAdminMyClub from "../pages/clubAdminMyClub/ClubAdminMyClub";
import UserMyOwnClub from "../pages/userMyOwnClub/UserMyOwnClub";
import { useNavigate } from "react-router-dom";
function MyClubs() {
  const navigate = useNavigate();
  React.useEffect(() => {
    if (!localStorage.getItem("userData")) {
      navigate("/");
    }
  }, []);
  return (
    <div>
      {JSON.parse(localStorage.getItem("userData")) &&
      JSON.parse(localStorage.getItem("userData")).clubAdmin ? (
        <ClubAdminMyClub />
      ) : (
        <UserMyOwnClub />
      )}
    </div>
  );
}

export default MyClubs;
