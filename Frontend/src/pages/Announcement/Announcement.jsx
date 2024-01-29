// Announcement.js

import React, { useState, useEffect } from "react";
import { format } from "timeago.js";
import "./announcement.css";
import { FaRegThumbsUp } from "react-icons/fa";
import { FaRegCommentDots } from "react-icons/fa";

function Announcement() {
  const [announcements, setAnnouncements] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoaded, setIsLoaded] = useState(true);
  const [likes, setLikes] = useState([]);

  React.useEffect(() => {
    fetch("http://localhost:5011/api/user/likes", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${
          JSON.parse(localStorage.getItem("userData")) &&
          JSON.parse(localStorage.getItem("userData")).token
        }`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        data.forEach((like) => {
          setLikes((likes) => [...likes, like._id]);
        });
      })
      .catch((error) => {
        console.error("Error fetching likes:", error);
      });
  }, []);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    picture: "",
  });
  const handleSubmit = (event) => {
    event.preventDefault();
    if (formData.title == "" || formData.description == "") {
      alert("Please fill in all the fields.");
      return;
    }
    // Post announcement
    fetch("http://localhost:5011/api/announcement/post", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${
          JSON.parse(localStorage.getItem("userData")) &&
          JSON.parse(localStorage.getItem("userData")).token
        }`,
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        setAnnouncements([data, ...announcements]);
        setFormData({
          title: "",
          description: "",
          picture: "",
        });
      })
      .catch((error) => {
        console.error("Error posting announcement:", error);
      });
  };
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  useEffect(() => {
    // Fetch announcements
    fetch("http://localhost:5011/api/announcement", {
      headers: {
        Authorization: `Bearer ${
          JSON.parse(localStorage.getItem("userData")) &&
          JSON.parse(localStorage.getItem("userData")).token
        }`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setAnnouncements(data);
        setIsLoaded(false);
      })
      .catch((error) => {
        console.error("Error fetching announcements:", error);
        setIsLoaded(false);
      });

    // Check admin privilege
    const userData = JSON.parse(localStorage.getItem("userData"));
    if (userData && userData.isAdmin) {
      setIsAdmin(true);
    }
  }, []);

  // Handle like
  const handleLike = (announcementId) => {
    fetch(`http://localhost:5011/api/user/like/${announcementId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${
          JSON.parse(localStorage.getItem("userData")) &&
          JSON.parse(localStorage.getItem("userData")).token
        }`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (likes.includes(announcementId)) {
          setLikes(likes.filter((like) => like !== announcementId));
        } else {
          setLikes([...likes, announcementId]);
        }
      })
      .catch((error) => {
        console.error("Error liking announcement:", error);
      });
  };

  // Handle comment
  const handleComment = (announcementId) => {
    console.log("Comment button clicked for announcement:", announcementId);
  };

  // JSX for the announcement card

  return (
    <div className="announcement-page">
      {isAdmin && (
        <form onSubmit={handleSubmit} className="announcement-admin-form">
          <label className="announcement-form-label">
            Title:
            <input
              type="text"
              name="title"
              value={formData.title}
              // Add state and event handlers here
              className="announcement-form-input"
              onChange={handleChange}
              required
            />
          </label>

          <label className="announcement-form-label">
            Description:
            <textarea
              name="description"
              // Add state and event handlers here
              className="announcement-form-textarea"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </label>

          <label className="announcement-form-label">
            Picture:
            <input
              type="text"
              name="picture"
              value={formData.picture}
              onChange={handleChange}
              // Add state and event handlers here
              className="announcement-form-input"
            />
          </label>

          <button type="submit" className="announcement-form-button">
            Post Announcement
          </button>
        </form>
      )}
      <div className="announcement-posts">
        {isLoaded ? (
          <div className="nice-spinner"></div>
        ) : (
          announcements.map((announcement) => (
            <div key={announcement._id} className="announcement-card">
              <div className="announcemnt-1-1-container">
                <div className="announcemnt-1-container">
                  <img
                    src={announcement.picture}
                    alt="Announcement"
                    className="announcement-card-img"
                  />
                  <p className="announcement-card-timeago">
                    {format(announcement.createdAt)}
                  </p>
                </div>
                <div className="announcement-card-info">
                  <h2 className="announcement-card-title">
                    {announcement.title}
                  </h2>
                  <p className="announcement-card-desc">
                    {announcement.description}
                  </p>
                </div>
              </div>
              <div className="announcement-card-actions">
                <FaRegThumbsUp
                  style={
                    likes.includes(announcement._id)
                      ? { color: "blue" }
                      : { color: "black" }
                  }
                  onClick={() => handleLike(announcement._id)}
                  className="announcement-like-button"
                />
                <FaRegCommentDots
                  onClick={() => handleComment(announcement._id)}
                  className="announcement-comment-button"
                />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Announcement;
