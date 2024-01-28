import React from "react";
import "./Announcement.css";
import { useNavigate } from "react-router-dom";

function Announcement() {
  const navigate = useNavigate();
  React.useEffect(() => {
    if (!localStorage.getItem("userData")) {
      navigate("/login");
    }
  }, []);
  return <div>Announcement</div>;
}

export default Announcement;
