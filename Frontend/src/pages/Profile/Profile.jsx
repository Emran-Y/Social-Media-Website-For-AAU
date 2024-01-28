import React from "react";
import "./Profile.css";
import { useNavigate } from "react-router-dom";
import { format } from "timeago.js";

function Profile() {
  const [userData, setUserData] = React.useState({}); // [1
  const [comments, setComments] = React.useState([]); // [2
  const [likes, setLikes] = React.useState([]); // [3
  const [currentActivity, setCurrentActivity] = React.useState("comments"); // [4
  const handleActivityChange = (activity) => {
    currentActivity == "comments"
      ? setCurrentActivity("likes")
      : setCurrentActivity("comments");
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
    fetch("http://localhost:5011/api/user/likes", {
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
    fetch("http://localhost:5011/api/user/comments", {
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

  const handleLogOut = () => {
    const confirmation = window.confirm("Are you sure you want to log out?");
    if (confirmation) {
      localStorage.removeItem("userData");
      navigate("/login");
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-logout-container">
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
      <div className="profile-2">
        <div className="profile-2-1">
          <h2 className="profile-2-1-title">Activity</h2>
          <div className="profile-2-1-buttons">
            <button
              style={
                currentActivity === "likes"
                  ? { backgroundColor: "#3A7BBA", color: "white" }
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
                  ? { backgroundColor: "#3A7BBA", color: "white" }
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
            {currentActivity == "comments"
              ? comments &&
                comments.map((comment) => {
                  return (
                    <div className="profile-2-2-feed-card">
                      <p>
                        <span className="profile-2-2-commenter">
                          {userData && userData.fullName}
                        </span>{" "}
                        commented on a post - {format(comment.updatedAt)}
                      </p>
                      <p className="profile-2-2-comment">{comment.content}</p>
                    </div>
                  );
                })
              : likes &&
                likes.map((like) => {
                  return (
                    <div className="profile-2-2-feed-card">
                      <p>
                        <span className="profile-2-2-commenter">
                          {userData && userData.fullName}
                        </span>{" "}
                        liked on a post - {format(like.updatedAt)}
                      </p>
                      <p className="profile-2-2-comment">{like.title}</p>
                    </div>
                  );
                })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
