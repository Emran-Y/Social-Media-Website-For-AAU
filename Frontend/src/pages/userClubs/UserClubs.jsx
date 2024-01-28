import React from "react";
import "./UserClubs.css";
import { useNavigate } from "react-router-dom";

function UserClubs() {
  const navigate = useNavigate();
  React.useEffect(() => {
    if (!localStorage.getItem("userData")) {
      navigate("/login");
    }
  }, []);
  return <div>UserClubs</div>;
}

export default UserClubs;
