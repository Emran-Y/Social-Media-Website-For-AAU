import React from "react";
import ClubAdminPendings from "../pages/clubAdminPendings/ClubAdminPendings";
import UserClubs from "../pages/userClubs/UserClubs";
import { useNavigate } from "react-router-dom";

function Clubs() {
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
        <ClubAdminPendings />
      ) : (
        <UserClubs />
      )}
    </div>
  );
}

export default Clubs;
