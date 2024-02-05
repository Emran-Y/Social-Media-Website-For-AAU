import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/layout";
import Login from "../src/pages/login/login";
import Signup from "../src/pages/signup/signup";
import Announcement from "../src/pages/Announcement/Announcement";
import JobsAndInternships from "../src/pages/JobsAndInternships/JobsAndInternships";
import LostAndFound from "../src/pages/lostAndFound/LostAndFound";
import Profile from "../src/pages/profile/Profile";
import UserProfile from "../src/pages/UserProfile/userProfile";
import NotFound from "../src/pages/NotFound/NotFound";
import MyClubs from "@conditionalPage/MyClubs";
import Clubs from "@conditionalPage/clubs";
import Home from "../src/pages/home/home"; // Import your Home component
import OneAnnouncement from "../src/pages/oneAnnouncement/OneAnnouncement";

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />{" "}
            {/* Display Home component for exact path */}
            <Route path="/announcement" element={<Announcement />} />
            <Route
              path="/announcement/:announcementId"
              element={<OneAnnouncement />}
            />
            <Route
              path="/jobsAndInternships"
              element={<JobsAndInternships />}
            />
            <Route path="/lostAndFound" element={<LostAndFound />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/:userId" element={<UserProfile />} />
            <Route path="/clubs" element={<Clubs />} />
            <Route path="/myclubs" element={<MyClubs />} />
            {/* 404 route */}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
