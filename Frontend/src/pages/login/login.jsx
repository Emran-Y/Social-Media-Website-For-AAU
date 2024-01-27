import React from "react";
import "./login.css";
import { IoPerson } from "react-icons/io5";
import { PiLockKeyFill } from "react-icons/pi";
import { useNavigate, Link } from "react-router-dom";
function Login() {
  const navigate = useNavigate();
  if (localStorage.getItem("userData")) {
    navigate("/announcement");
  }
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [erroMessage, setErrorMessage] = React.useState("");
  const [showError, setShowError] = React.useState(false);

  const submitHandler = (e) => {
    e.preventDefault();
    if (!username || !password) {
      setShowError(true);
      setErrorMessage("Please fill all the fields");
      return;
    }
    const data = {
      username: username,
      password,
    };
    setUsername("");
    setPassword("");
    setShowError(false);
    let status;
    fetch("http://localhost:5011/api/user/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
      }),
    })
      .then((res) => {
        status = res.status;
        return res.json();
      })
      .then((data) => {
        if (status === 200) {
          localStorage.setItem(
            "userData",
            JSON.stringify({
              token: data.token,
              userId: data._id,
              profilePicture: data.profilePicture,
              fieldOfStudy: data.fieldOfStudy,
              fullName: data.fullName,
              isAdmin: data.isAdmin,
              clubAdmin: data.clubAdmin,
            })
          );

          navigate("/announcement");
        } else {
          setShowError(true);
          setErrorMessage(data.message);
        }
      });
  };

  return (
    <div className="login-container">
      <div className="login-header">
        <h1 className="login-header-title">AAU Social Media Platform</h1>
        <p className="login-signup">
          New User?
          <Link to="/signup" style={{ textDecoration: "none" }}>
            <span className="login-signup-link"> Sign Up</span>
          </Link>
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
          <form onSubmit={submitHandler}>
            <div className="login-username-container">
              <IoPerson className="login-username-icon" />
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                type="text"
                placeholder="Username"
                className="login-username"
              />
            </div>
            <div className="login-password-container">
              <PiLockKeyFill className="login-password-icon" />
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="Password"
                className="login-password"
              />
            </div>
            {showError && <p className="login-error-message">{erroMessage}</p>}
            <button className="login-btn">Login</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
