import React from "react";
import "./leftText.css";
import { Link } from "react-router-dom";

function LeftText({ content, name, pic, time, userId }) {
  return (
    <div className="left-text-cont">
      <div className="img-msg">
        <img src={pic} alt="" className="sender-img" />
        <div className="text-cont">
          <Link to={`/profile/${userId}`} className="name-sender">
            {name}
          </Link>
          <p className="left-text">{content}</p>
        </div>
      </div>
      <p className="time-ago">{time}</p>
    </div>
  );
}

export default LeftText;
