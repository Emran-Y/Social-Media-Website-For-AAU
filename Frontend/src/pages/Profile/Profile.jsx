import React from "react";
import "./profile.css";
import { useNavigate, Link } from "react-router-dom";
import { format } from "timeago.js";
import { MdEdit } from "react-icons/md";
import backend_url from "../../backend";

function Profile() {
  const [userData, setUserData] = React.useState({});
  const [comments, setComments] = React.useState([]);
  const [likes, setLikes] = React.useState([]);
  const [currentActivity, setCurrentActivity] = React.useState("comments");
  const [isEditing, setIsEditing] = React.useState(false);
  const [editedName, setEditedName] = React.useState("");
  const [editedFieldOfStudy, setEditedFieldOfStudy] = React.useState("");
  const [editedImage, setEditedImage] = React.useState(
    (JSON.parse(localStorage.getItem("userData")) &&
      JSON.parse(localStorage.getItem("userData")).profilePicture) ||
      null
  );
  const [isUploading, setIsUploading] = React.useState(false);

  const handleActivityChange = () => {
    setCurrentActivity((prevActivity) =>
      prevActivity === "comments" ? "likes" : "comments"
    );
  };

  const navigate = useNavigate();

  React.useEffect(() => {
    if (!localStorage.getItem("userData")) {
      navigate("/login");
    }
  }, []);

  React.useEffect(() => {
    setUserData(JSON.parse(localStorage.getItem("userData")));
  }, []);

  React.useEffect(() => {
    console.log(userData && userData.token);
    fetch(`${backend_url}/api/user/likes`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${
          JSON.parse(localStorage.getItem("userData")) &&
          JSON.parse(localStorage.getItem("userData")).token
        }`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        setLikes(data);
      })
      .catch((error) => {
        console.error("Fetch error:", error);
        // Handle the error as needed
      });
  }, []);
  React.useEffect(() => {
    console.log(userData && userData.token);
    fetch(`${backend_url}/api/user/comments`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${
          JSON.parse(localStorage.getItem("userData")) &&
          JSON.parse(localStorage.getItem("userData")).token
        }`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        setComments(data);
      })
      .catch((error) => {
        console.error("Fetch error:", error);
        // Handle the error as needed
      });
  }, []);

  React.useEffect(() => {
    if (isEditing) {
      // Additional logic when entering edit mode
      setEditedName(userData.fullName);
      setEditedFieldOfStudy(userData.fieldOfStudy);
      // You can add more logic for other fields if needed
    }
  }, [isEditing, userData]);

  const handleLogOut = () => {
    const confirmation = window.confirm("Are you sure you want to log out?");
    if (confirmation) {
      localStorage.removeItem("userData");
      navigate("/");
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setEditedName("");
    setEditedFieldOfStudy("");
    setEditedImage(null);
    setIsEditing(false);
  };

  const handleSaveEdit = () => {
    // // This is where you would handle the save logic (e.g., API request)
    // console.log("Saving changes...");
    // console.log("Name:", editedName);
    // console.log("Field of Study:", editedFieldOfStudy);
    // console.log("Image:", editedImage);

    fetch(`${backend_url}/api/user/editProfile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${
          JSON.parse(localStorage.getItem("userData")) &&
          JSON.parse(localStorage.getItem("userData")).token
        }`,
      },
      body: JSON.stringify({
        fullName: editedName ? editedName : userData.fullName,
        fieldOfStudy: editedFieldOfStudy
          ? editedFieldOfStudy
          : userData.fieldOfStudy,
        profilePicture: editedImage ? editedImage : userData.profilePicture,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        localStorage.setItem("userData", JSON.stringify(data));
        setUserData(data);
      })
      .catch((error) => {
        console.error("Fetch error:", error);
        // Handle the error as needed
      });

    // Reset state after saving changes
    setIsEditing(false);
    setEditedName("");
    setEditedFieldOfStudy("");
    setEditedImage(null);
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
        setEditedImage(data.secure_url);
        setIsUploading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsUploading(false);
      });
  };

  return (
    <div className="profile-container">
      <div className="profile-1-header">
        {isEditing && (
          <div className="profile-1-header-edit-form">
            <div className="profile-edit-inputs">
              <label htmlFor="name-input" className="profile-input-label">
                Name
              </label>
              <input
                type="text"
                id="name-input"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                className="profile-input"
                placeholder="Enter your name"
              />
              <label htmlFor="field-input" className="profile-input-label">
                Field of Study
              </label>
              <input
                type="text"
                id="field-input"
                value={editedFieldOfStudy}
                onChange={(e) => setEditedFieldOfStudy(e.target.value)}
                className="profile-input"
                placeholder="Enter your field of study"
              />
              <div className="profile-img-container">
                <label
                  htmlFor="profile-image-input"
                  className="profile-image-label"
                >
                  Change Profile Picture
                </label>
                <input
                  type="file"
                  id="profile-image-input"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e.target.files[0])}
                  className="profile-image-input"
                />
              </div>
            </div>
            <div className="profile-edit-buttons">
              <button
                className="profile-1-header-save"
                onClick={handleSaveEdit}
              >
                {isUploading ? "Uploading..." : "Save"}
              </button>
              <button
                className="profile-1-header-cancel"
                onClick={handleCancelEdit}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
        <div className="profile-logout-container">
          <button
            className="profile-1-header-edit"
            onClick={handleEditClick}
            disabled={isEditing}
          >
            Edit
          </button>
          <button onClick={handleLogOut} className="profile-logout-btn">
            Log Out
          </button>
        </div>
        <div className="profile-1">
          <div className="profile-img-container">
            <img
              src={userData && userData.profilePicture}
              alt=""
              className="profile-img"
            />
          </div>
          <div className="profile-userinfo-container">
            <h2 className="profile-userinfo-name">
              {userData && userData.fullName}
            </h2>
            <p className="profile-userinfo-fieldofstudy">
              {userData && userData.fieldOfStudy}
            </p>
          </div>
        </div>
      </div>
      <div className="profile-2">
        <div className="profile-2-1">
          <h2 className="profile-2-1-title">Activity</h2>
          <div className="profile-2-1-buttons">
            <button
              style={
                currentActivity === "likes"
                  ? { backgroundColor: "var(--primary-color)", color: "white" }
                  : {
                      backgroundColor: "#ccc",
                      color: "black",
                    }
              }
              onClick={() => setCurrentActivity("likes")}
              className="profile-2-1-like"
            >
              Likes
            </button>
            <button
              style={
                currentActivity === "comments"
                  ? { backgroundColor: "var(--primary-color)", color: "white" }
                  : {
                      backgroundColor: "#ccc",
                      color: "black",
                    }
              }
              onClick={() => setCurrentActivity("comments")}
              className="profile-2-1-comment"
            >
              Comments
            </button>
          </div>
        </div>
        <div className="profile-2-2">
          <div className="profile-2-2-feed">
            {currentActivity === "comments"
              ? comments &&
                comments.map((comment) => {
                  return (
                    <Link
                      to={`/announcement/${comment.announcementId._id}`}
                      style={{
                        cursor: "pointer",
                        textDecoration: "none",
                        color: "black",
                      }}
                      className="profile-2-2-feed-card"
                      key={comment.id}
                    >
                      <p>
                        <span className="profile-2-2-commenter">
                          {userData && userData.fullName}
                        </span>{" "}
                        commented on a post - {format(comment.updatedAt)}
                      </p>
                      <p className="profile-2-2-comment">{comment.content}</p>
                    </Link>
                  );
                })
              : likes &&
                likes.map((like) => {
                  return (
                    <Link
                      to={`/announcement/${like._id}`}
                      style={{
                        cursor: "pointer",
                        textDecoration: "none",
                        color: "black",
                      }}
                      className="profile-2-2-feed-card"
                      key={like.id}
                    >
                      <p>
                        <span className="profile-2-2-commenter">
                          {userData && userData.fullName}
                        </span>{" "}
                        liked on a post - {format(like.updatedAt)}
                      </p>
                      <p className="profile-2-2-comment">{like.title}</p>
                    </Link>
                  );
                })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
