import React from "react";
import { useNavigate } from "react-router-dom";
import "./notFound.css";

function NotFound() {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate("/login");
  };

  return (
    <div className="notfound-container">
      <h1 className="notfound-title">404 - Not Found</h1>
      <p className="notfound-description">
        The page you are looking for might not exist.
      </p>
      <button className="notfound-back-btn" onClick={handleBackClick}>
        Move Back
      </button>
    </div>
  );
}

export default NotFound;
