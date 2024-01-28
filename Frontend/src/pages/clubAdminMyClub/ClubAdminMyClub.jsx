import React from "react";
import "./ClubAdminMyClub.css";
import { useNavigate } from "react-router-dom";

function ClubAdminMyClub() {
  const navigate = useNavigate();
  React.useEffect(() => {
    if (!localStorage.getItem("userData")) {
      navigate("/login");
    }
  }, []);
  return <div>ClubAdminMyClub</div>;
}

export default ClubAdminMyClub;
