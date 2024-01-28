import React from "react";
import "./LostAndFound.css";
import { useNavigate } from "react-router-dom";

function LostAndFound() {
  React.useEffect(() => {
    if (!localStorage.getItem("userData")) {
      navigate("/login");
    }
  }, []);
  return <div>LostAndFound</div>;
}

export default LostAndFound;
