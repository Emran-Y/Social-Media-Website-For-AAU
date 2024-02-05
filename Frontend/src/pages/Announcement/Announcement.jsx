// Announcement.js

import React, { useState, useEffect } from "react";
import { format } from "timeago.js";
import "./announcement.css";
import {
  FaRegThumbsUp,
  FaRegCommentDots,
  FaTrashAlt,
  FaEdit,
} from "react-icons/fa";
import CommentSection from "../Comment/Comment";
import { useNavigate } from "react-router-dom";
import backend_url from "../../backend.js";

function Announcement() {
  const navigate = useNavigate();
  React.useEffect(() => {
    if (!localStorage.getItem("userData")) {
      navigate("/login");
    }
  }, []);
  const [announcements, setAnnouncements] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoaded, setIsLoaded] = useState(true);
  const [likes, setLikes] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });
  const [profilePicture, setProfilePicture] = React.useState("");
  const [isUploading, setIsUploading] = React.useState(false);

  const [currentCommentingAnnouncemnt, setCurrentCommentingAnnouncemnt] =
    useState("");

  React.useEffect(() => {
    fetch(`${backend_url}/api/user/likes`, {
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

  const handleSubmit = (event) => {
    event.preventDefault();
    if (formData.title === "" || formData.description === "") {
      alert("Please fill in all the fields.");
      return;
    }

    // Post announcement
    fetch(`${backend_url}/api/announcement/post`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${
          JSON.parse(localStorage.getItem("userData")) &&
          JSON.parse(localStorage.getItem("userData")).token
        }`,
      },
      body: JSON.stringify({ ...formData, picture: profilePicture }),
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
    fetch(`${backend_url}/api/announcement`, {
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

  const handleLike = (announcementId) => {
    fetch(`${backend_url}/api/user/like/${announcementId}`, {
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

  const handleComment = (announcementId) => {
    setCurrentCommentingAnnouncemnt(
      currentCommentingAnnouncemnt === announcementId ? "" : announcementId
    );
  };

  const handleDelete = (announcementId) => {
    // Delete announcement
    fetch(`${backend_url}/api/announcement/delete/${announcementId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${
          JSON.parse(localStorage.getItem("userData")) &&
          JSON.parse(localStorage.getItem("userData")).token
        }`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setAnnouncements(announcements.filter((a) => a._id !== announcementId));
      })
      .catch((error) => {
        console.error("Error deleting announcement:", error);
      });
  };

  const handleUpdate = (announcementId) => {
    // Update announcement
    if (!formData.title && !formData.description && !profilePicture) {
      alert("Please fill in at least one field.");
      return;
    }

    const dataToBeSent = {
      title: formData.title !== "" ? formData.title : undefined,
      description:
        formData.description !== "" ? formData.description : undefined,
      picture: profilePicture !== "" ? profilePicture : undefined,
    };

    fetch(`${backend_url}/api/announcement/update/${announcementId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${
          JSON.parse(localStorage.getItem("userData")) &&
          JSON.parse(localStorage.getItem("userData")).token
        }`,
      },
      body: JSON.stringify(dataToBeSent),
    })
      .then((response) => response.json())
      .then((data) => {
        // Update the state with the modified announcement
        setAnnouncements(
          announcements.map((a) =>
            a._id === announcementId ? { ...a, ...data } : a
          )
        );

        // Clear the form data
        setFormData({
          title: "",
          description: "",
        });
        setProfilePicture("");
      })
      .catch((error) => {
        console.error("Error updating announcement:", error);
      });
  };

  const handleFileChange = (image) => {
    setIsUploading(true);
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "tohco7vu");

    fetch(`https://api.cloudinary.com/v1_1/difavbhph/image/upload`, {
      method: "post",
      body: data,
    })
      .then((res) => res.json())
      .then((data) => {
        setProfilePicture(data.secure_url);
        setIsUploading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsUploading(false);
      });
  };

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
              onChange={handleChange}
              className="announcement-form-input"
              required
            />
          </label>

          <label className="announcement-form-label">
            Description:
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="announcement-form-textarea"
              required
            />
          </label>

          <label className="announcement-form-label">
            Picture:
            <input
              type="file"
              name="picture"
              onChange={(e) => handleFileChange(e.target.files[0])}
              className="announcement-form-input"
              placeholder="Upload a picture"
            />
          </label>

          <button type="submit" className="announcement-form-button">
            {isUploading ? "uploading..." : "Post Announcement"}
          </button>
        </form>
      )}
      <div className="announcement-posts">
        {isLoaded ? (
          <div className="nice-spinner"></div>
        ) : announcements.length === 0 ? (
          <div className="clubadminpendings-card">
            <p
              style={{ textAlign: "center" }}
              className="clubadminpendings-username"
            >
              No announcements
            </p>
          </div>
        ) : (
          announcements.map((announcement) => (
            <div key={announcement._id} className="announcement-card">
              {isAdmin && (
                <div className="announcement-change-maker-button">
                  <button
                    onClick={() => handleDelete(announcement._id)}
                    className="announcement-delete-button"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => {
                      handleUpdate(announcement._id);
                    }}
                    className="announcement-update-button"
                  >
                    Update
                  </button>
                </div>
              )}
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
                  style={{
                    color: likes.includes(announcement._id) ? "blue" : "black",
                    ...((currentCommentingAnnouncemnt === "" ||
                      currentCommentingAnnouncemnt !== announcement._id) && {
                      position: "absolute",
                    }),
                  }}
                  onClick={() => handleLike(announcement._id)}
                  className="announcement-like-button"
                />
                <FaRegCommentDots
                  style={
                    currentCommentingAnnouncemnt === "" ||
                    currentCommentingAnnouncemnt !== announcement._id
                      ? { position: "absolute" }
                      : { position: "static" }
                  }
                  onClick={() => handleComment(announcement._id)}
                  className="announcement-comment-button"
                />
              </div>
              {currentCommentingAnnouncemnt === announcement._id && (
                <CommentSection announcementId={announcement._id} />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Announcement;
