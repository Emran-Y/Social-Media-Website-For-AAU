import React from "react";
import "./ClubAdminPendings.css";
import { useNavigate } from "react-router-dom";

function ClubAdminPendings() {
  const navigate = useNavigate();
  React.useEffect(() => {
    if (!localStorage.getItem("userData")) {
      navigate("/login");
    }
  }, []);
  return <div>ClubAdminPendings</div>;
}

export default ClubAdminPendings;
