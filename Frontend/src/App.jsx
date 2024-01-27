import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layout";
import Login from "./pages/login/login";
import Signup from "./pages/signup/signup";
import Announcement from "./pages/announcement/Announcement";
import JobsAndInternships from "./pages/jobsAndInternships/JobsAndInternships";
import LostAndFound from "./pages/lostAndFound/LostAndFound";
import Profile from "./pages/profile/Profile";
import NotFound from "./pages/NotFound/NotFound"; // Add the import for your 404 component
import MyClubs from "./ConditionalPages/MyClubs";
import Clubs from "./ConditionalPages/clubs";

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<Layout />}>
            <Route path="/announcement" element={<Announcement />} />
            <Route
              path="/jobsAndInternships"
              element={<JobsAndInternships />}
            />
            <Route path="/lostAndFound" element={<LostAndFound />} />
            <Route path="/profile" element={<Profile />} />
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
