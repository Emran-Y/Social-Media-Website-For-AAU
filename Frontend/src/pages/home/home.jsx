import React from "react";
import { Link } from "react-router-dom";
import "./home.css";
import { useNavigate } from "react-router-dom";

function Home() {
  // const navigate = useNavigate();
  // if (!localStorage.getItem("userData")) {
  //   navigate("/login");
  // }
  return (
    <div className="home-page-container">
      <div className="home-page-content">
        <h1 className="home-page-title">
          Welcome to AAU Social Media Platform
        </h1>
        <p className="home-page-description">
          Connect with your university community on our social media platform.
          Stay informed about announcements, join clubs, and explore
          opportunities.
        </p>
        <div className="home-page-buttons">
          <Link to="/profile" className="home-page-btn">
            Go to Profile
          </Link>
          <Link to="/announcement" className="home-page-btn">
            View Announcements
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;
