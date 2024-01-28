import React from "react";
import "./Profile.css";
import { useNavigate } from "react-router-dom";

function Profile() {
  React.useEffect(() => {
    if (!localStorage.getItem("userData")) {
      navigate("/login");
    }
  }, []);
  return <div>Profile</div>;
}

export default Profile;
