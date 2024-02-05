import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/layout";
import Login from "@pages/login/login";
import Signup from "@pages/signup/signup";
import Announcement from "@pages/announcement/Announcement";
import JobsAndInternships from "@pages/JobsAndInternships/JobsAndInternships";
import LostAndFound from "@pages/lostAndFound/LostAndFound";
import Profile from "@pages/profile/Profile";
import UserProfile from "@pages/UserProfile/userProfile";
import NotFound from "@pages/NotFound/NotFound";
import MyClubs from "./ConditionalPages/MyClubs";
import Clubs from "./ConditionalPages/clubs";
import Home from "@pages/home/home"; // Import your Home component
import OneAnnouncement from "@pages/oneAnnouncement/OneAnnouncement";

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
