import React from "react";
import "./login.css";
import { IoPerson } from "react-icons/io5";
import { PiLockKeyFill } from "react-icons/pi";
function login() {
  return (
    <div className="login-container">
      <div className="login-header">
        <h1 className="login-header-title">AAU Social Media Platform</h1>
        <p className="login-signup">
          New User?<span className="login-signup-link"> Sign Up</span>
        </p>
      </div>
      <hr className="login-header-line" />
      <div className="login-main">
        <img
          className="login-image"
          src="./public/login_image.png"
          alt="login in image"
        />
        <div className="login-form-container">
          <div className="login-form-header">
            <h2 className="login-form-header-title">Welcome Back!</h2>
            <p className="login-form-header-cap">Login to continue</p>
          </div>
          <form>
            <div className="login-email-container">
              <IoPerson className="login-email-icon" />
              <input type="email" placeholder="Email" className="login-email" />
            </div>
            <div className="login-password-container">
              <PiLockKeyFill className="login-password-icon" />
              <input
                type="password"
                placeholder="Password"
                className="login-password"
              />
            </div>
            <button className="login-btn">Login</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default login;
