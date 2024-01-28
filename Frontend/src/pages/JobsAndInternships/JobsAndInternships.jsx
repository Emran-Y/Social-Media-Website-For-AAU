import React from "react";
import "./JobsAndInternships.css";
import { useNavigate } from "react-router-dom";

function JobsAndInternships() {
  const navigate = useNavigate();
  React.useEffect(() => {
    if (!localStorage.getItem("userData")) {
      navigate("/login");
    }
  }, []);
  return <div>JobsAndInternships</div>;
}

export default JobsAndInternships;
