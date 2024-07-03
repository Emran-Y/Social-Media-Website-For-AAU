import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "@/components/layout"; // Assuming an alias for "src" is defined
import Login from "@pages/login/login";
import Signup from "@pages/signup/signup";
import Announcement from "@pages/Announcement/Announcement";
import JobsAndInternships from "@pages/JobsAndInternships/JobsAndInternships";
import LostAndFound from "@pages/LostAndFound/LostAndFound";
import Profile from "@pages/Profile/Profile";
import UserProfile from "@pages/UserProfile/UserProfile";
import NotFound from "@pages/NotFound/NotFound";
import MyClubs from "@conditionalPage/MyClubs";
import Clubs from "@conditionalPage/Clubs";
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
            {/* Display Home component for the exact path */}
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
