// CommentSection.js

import React, { useState } from "react";
import "./comment.css";
import { Link } from "react-router-dom";
import { format } from "timeago.js";

const CommentSection = ({ announcementId }) => {
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState([]);

  React.useEffect(() => {
    fetch(
      `http://localhost:5011/api/announcement/allcomments/${announcementId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${
            JSON.parse(localStorage.getItem("userData")) &&
            JSON.parse(localStorage.getItem("userData")).token
          }`,
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        setComments(data);
      })
      .catch((error) => {
        console.error("Error fetching comments:", error);
      });
  }, []);

  const handleCommentChange = (event) => {
    setNewComment(event.target.value);
  };

  const handleCommentSubmit = () => {
    if (newComment === "") return;
    const dataToSend = {
      content: newComment,
      announcementId: announcementId,
      userId: JSON.parse(localStorage.getItem("userData")).userId,
    };
    fetch("http://localhost:5011/api/comment/post", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${
          JSON.parse(localStorage.getItem("userData")) &&
          JSON.parse(localStorage.getItem("userData")).token
        }`,
      },
      body: JSON.stringify(dataToSend),
    })
      .then((response) => response.json())
      .then((data) => {
        setComments([data, ...comments]);
        setNewComment("");
      })
      .catch((error) => {
        console.error("Error posting comment:", error);
      });
  };

  return (
    <div className="comment-section">
      <div className="comment-input">
        <textarea
          placeholder="Add a comment..."
          value={newComment}
          onChange={handleCommentChange}
        />
        <button onClick={handleCommentSubmit}>Post</button>
      </div>
      <div className="comments-list">
        {comments &&
          comments.map((comment) => (
            <div key={comment.id} className="comment-item">
              <img
                src={comment.userId.profilePicture}
                alt="profile pic"
                className="comment-profile-pic"
              />
              <div className="comment-left-detail">
                <div className="commenter-main-info">
                  {/* <Link to={`/profile/${comment.userId}`}>Emran</Link> */}
                  <div className="commenter-main-info-header">
                    <Link
                      to={`/profile/${comment.userId._id}`}
                      className="commenter-name"
                    >
                      {comment.userId.fullName}{" "}
                    </Link>
                    <p className="comment-timeago">
                      {format(comment.updatedAt)}
                    </p>
                  </div>
                  <p className="commenter-fieldOfStudy">
                    {comment.userId.fieldOfStudy}
                  </p>
                </div>
                <p className="comment-content">{comment.content}</p>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default CommentSection;
