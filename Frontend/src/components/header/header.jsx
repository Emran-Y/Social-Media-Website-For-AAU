import React from "react";
import "./header.css";
import { Link, useLocation } from "react-router-dom";

function Header() {
  const location = useLocation();
  const [activeNav, setActiveNav] = React.useState("header-navigation");
  const [userData, setUserData] = React.useState({});
  React.useEffect(() => {
    setUserData(JSON.parse(localStorage.getItem("userData")));
  }, []);
  const navToggler = () => {
    activeNav == "header-navigation"
      ? setActiveNav("header-navigation active-nav")
      : setActiveNav("header-navigation");
  };
  return (
    <header className="header-container">
      <div className="header-1">
        <div className="header-1-wrapper">
          <img
            src="../public/Addis_Ababa_University_logo.png"
            alt="aau logo"
            className="header-logo"
          />
          <h2 className="header-slogan">
            Addis Ababa University Social Media Platform: The New Way To Get Our
            Community Connected!
          </h2>
        </div>
      </div>
      <div className="header-2">
        <Link to="profile">
          <img
            src={
              userData
                ? userData.profilePicture
                : "https://www.pngall.com/wp-content/uploads/12/Avatar-Profile-PNG-Images.png"
            }
            alt="profile pic"
            className="header-profile"
          ></img>
        </Link>
        <div className="togglers-wrapper" onClick={navToggler}>
          <div className="header-togglers line1"></div>
          <div className="header-togglers line2"></div>
          <div className="header-togglers line3"></div>
        </div>
        <nav className={activeNav}>
          {userData && (
            <ul className="nav-menus">
              {userData.clubAdmin ? (
                <li onClick={navToggler}>
                  <Link
                    style={{
                      textDecoration:
                        location.pathname === "/clubs" ? "underline" : "none",
                    }}
                    to="clubs"
                  >
                    Pendings
                  </Link>
                </li>
              ) : (
                <li onClick={navToggler}>
                  <Link
                    style={{
                      textDecoration:
                        location.pathname === "/clubs" ? "underline" : "none",
                    }}
                    to="clubs"
                  >
                    Clubs
                  </Link>
                </li>
              )}
              {userData.clubAdmin ? (
                <li onClick={navToggler}>
                  <Link
                    style={{
                      textDecoration:
                        location.pathname === "/myclubs" ? "underline" : "none",
                    }}
                    to="myclubs"
                  >
                    My Club
                  </Link>
                </li>
              ) : (
                <li onClick={navToggler}>
                  <Link
                    style={{
                      textDecoration:
                        location.pathname === "/myclubs" ? "underline" : "none",
                    }}
                    to="myclubs"
                  >
                    My Clubs
                  </Link>
                </li>
              )}
              <li onClick={navToggler}>
                <Link
                  style={{
                    textDecoration:
                      location.pathname === "/lostAndFound"
                        ? "underline"
                        : "none",
                  }}
                  to="lostAndFound"
                >
                  Lost and Found
                </Link>
              </li>
              <li onClick={navToggler}>
                <Link
                  style={{
                    textDecoration:
                      location.pathname === "/jobsandinternships"
                        ? "underline"
                        : "none",
                  }}
                  to="jobsandinternships"
                >
                  Jobs and Internships
                </Link>
              </li>
              <li onClick={navToggler}>
                <Link
                  style={{
                    textDecoration:
                      location.pathname === "/announcement"
                        ? "underline"
                        : "none",
                  }}
                  to="announcement"
                >
                  Announcement
                </Link>
              </li>
            </ul>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;

// Clubs , My Clubs , Lost and Found, Jobs and Internships , Announcement
// Pendings , My Club , Lost and Found, Jobs and Internships , Announcement

// profile on mobile to left on large screen on right
