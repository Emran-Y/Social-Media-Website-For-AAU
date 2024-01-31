// Announcement.js

import React, { useState, useEffect } from "react";
import { format } from "timeago.js";
import "../Announcement/announcement.css";
import {
  FaRegThumbsUp,
  FaRegCommentDots,
  FaTrashAlt,
  FaEdit,
} from "react-icons/fa";
import CommentSection from "../Comment/Comment";
import { useNavigate, useParams } from "react-router-dom";

function Announcement() {
  const navigate = useNavigate();
  React.useEffect(() => {
    if (!localStorage.getItem("userData")) {
      navigate("/login");
    }
  }, []);
  const { announcementId } = useParams();
  console.log(announcementId);
  const [announcement, setAnnouncement] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
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

  const handleSubmit = (event) => {
    event.preventDefault();
    if (formData.title === "" || formData.description === "") {
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
      body: JSON.stringify({ ...formData, picture: profilePicture }),
    })
      .then((response) => response.json())
      .then((data) => {
        setAnnouncement(data);
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
    // Fetch single announcement
    fetch(`http://localhost:5011/api/announcement/get/${announcementId}`, {
      headers: {
        Authorization: `Bearer ${
          JSON.parse(localStorage.getItem("userData")) &&
          JSON.parse(localStorage.getItem("userData")).token
        }`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message) {
          return setAnnouncement(null);
        }
        setAnnouncement(data);
      })
      .catch((error) => {
        console.error("Error fetching announcement:", error);
      });

    // Check admin privilege
    const userData = JSON.parse(localStorage.getItem("userData"));
    if (userData && userData.isAdmin) {
      setIsAdmin(true);
    }
  }, []);

  const handleLike = () => {
    fetch(`http://localhost:5011/api/user/like/${announcement._id}`, {
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
        if (likes.includes(announcement._id)) {
          setLikes(likes.filter((like) => like !== announcement._id));
        } else {
          setLikes([...likes, announcement._id]);
        }
      })
      .catch((error) => {
        console.error("Error liking announcement:", error);
      });
  };

  const handleComment = () => {
    setCurrentCommentingAnnouncemnt(
      currentCommentingAnnouncemnt === announcement._id ? "" : announcement._id
    );
  };

  const handleDelete = () => {
    // Delete announcement
    fetch(`http://localhost:5011/api/announcement/delete/${announcement._id}`, {
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
        setAnnouncement(null);
      })
      .catch((error) => {
        console.error("Error deleting announcement:", error);
      });
  };

  const handleUpdate = () => {
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

    fetch(`http://localhost:5011/api/announcement/update/${announcement._id}`, {
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
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setAnnouncement(data);

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
        {announcement ? (
          <div key={announcement._id} className="announcement-card">
            {isAdmin && (
              <div className="announcement-change-maker-button">
                <button
                  onClick={handleDelete}
                  className="announcement-delete-button"
                >
                  Delete
                </button>
                <button
                  onClick={handleUpdate}
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
                onClick={handleLike}
                className="announcement-like-button"
              />
              <FaRegCommentDots
                style={
                  currentCommentingAnnouncemnt === "" ||
                  currentCommentingAnnouncemnt !== announcement._id
                    ? { position: "absolute" }
                    : { position: "static" }
                }
                onClick={handleComment}
                className="announcement-comment-button"
              />
            </div>
            {currentCommentingAnnouncemnt === announcement._id && (
              <CommentSection announcementId={announcement._id} />
            )}
          </div>
        ) : (
          <div className="clubadminpendings-card">
            <p
              style={{ textAlign: "center" }}
              className="clubadminpendings-username"
            >
              Announcement does not exist
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Announcement;
