import React from "react";
import "./Club.css";
import { useNavigate } from "react-router-dom";

function Club() {
  const navigate = useNavigate();
  React.useEffect(() => {
    if (!localStorage.getItem("userData")) {
      navigate("/login");
    }
  }, []);
  return <div>Club</div>;
}

export default Club;
