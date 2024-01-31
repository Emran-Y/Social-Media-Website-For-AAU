import React from "react";
import { useNavigate, Link } from "react-router-dom";
import "./signup.css";

import { IoPerson } from "react-icons/io5";
import { PiLockKeyFill } from "react-icons/pi";
import { SiNamecheap } from "react-icons/si";
import { FcDepartment } from "react-icons/fc";
import { FaUniversity } from "react-icons/fa";
import { MdPassword } from "react-icons/md";
import { GiEgyptianProfile } from "react-icons/gi";

function Signup() {
  const navigate = useNavigate();
  React.useEffect(() => {
    if (localStorage.getItem("userData")) {
      navigate("/");
    }
  }, []);

  const [erroMessage, setErrorMessage] = React.useState("");
  const [showError, setShowError] = React.useState(false);
  const [fullName, setFullName] = React.useState("");
  const [fieldOfStudy, setFieldOfStudy] = React.useState("");
  const [universityId, setUniversityId] = React.useState("");
  const [universityPassword, setUniversityPassword] = React.useState("");
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [profilePicture, setProfilePicture] = React.useState("");
  const [isUploading, setIsUploading] = React.useState(false);

  const submitHandler = (e) => {
    e.preventDefault();
    if (
      !fullName ||
      !fieldOfStudy ||
      !universityId ||
      !universityPassword ||
      !username ||
      !password ||
      !confirmPassword
    ) {
      setShowError(true);
      setErrorMessage("Please fill all the fields");
      return;
    }
    if (password !== confirmPassword) {
      setShowError(true);
      setErrorMessage("Passwords do not match");
      return;
    }
    const data = {
      fullName: fullName,
      fieldOfStudy: fieldOfStudy,
      universityId: universityId,
      universityPassword: universityPassword,
      username: username,
      password: password,
      profilePicture: profilePicture,
    };
    let status;
    fetch("http://localhost:5011/api/user/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
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
              clubAdmin: data.clubAdmin,
            })
          );
          navigate("/announcement");
          setFullName("");
          setFieldOfStudy("");
          setUniversityId("");
          setUniversityPassword("");
          setUsername("");
          setPassword("");
          setConfirmPassword("");
          setProfilePicture("");
          setShowError(false);
          setErrorMessage("");
          console.log(data);
          return;
        } else {
          setShowError(true);
          setErrorMessage(data.message);
          return;
        }
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
    <div className="signup-container">
      <div className="signup-header">
        <h1 className="signup-header-title">AAU Social Media Platform</h1>
        <p className="signup-login">
          Already User?
          <Link to="/login" style={{ textDecoration: "none" }}>
            <span className="signup-login-link"> Log In</span>
          </Link>
        </p>
      </div>
      <hr className="signup-header-line" />
      <div className="signup-main">
        <img
          className="signup-image"
          src="./public/login_image.png"
          alt="login in image"
        />
        <div className="signup-form-container">
          <div className="signup-form-header">
            <h2 className="signup-form-header-title">Welcome Dear!</h2>
            <p className="signup-form-header-cap">Sign Up to continue</p>
          </div>
          <form onSubmit={submitHandler}>
            <div className="signup-username-container">
              <SiNamecheap className="signup-username-icon" />
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Full Name"
                className="signup-username"
              />
            </div>
            <div className="signup-username-container">
              <FcDepartment className="signup-username-icon" />
              <input
                value={fieldOfStudy}
                onChange={(e) => setFieldOfStudy(e.target.value)}
                placeholder="Field Of Study"
                className="signup-username"
              />
            </div>
            <div className="signup-username-container">
              <FaUniversity className="signup-username-icon" />
              <input
                value={universityId}
                onChange={(e) => setUniversityId(e.target.value)}
                placeholder="University Id"
                className="signup-username"
              />
            </div>
            <div className="signup-username-container">
              <MdPassword className="signup-username-icon" />
              <input
                value={universityPassword}
                onChange={(e) => setUniversityPassword(e.target.value)}
                placeholder="University Password"
                className="signup-password"
                type="password"
              />
            </div>
            <div className="signup-username-container">
              <IoPerson className="signup-username-icon" />
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                className="signup-username"
              />
            </div>
            <div className="signup-username-container-profile">
              <p className="signup-username-container-profile-title">
                Profile Picture (<strong>optional</strong>)
              </p>
              <input
                onChange={(e) => handleFileChange(e.target.files[0])}
                placeholder="Profile Picture"
                className="signup-username"
                type="file"
                id="profile-pic"
              />
            </div>
            <div className="signup-password-container">
              <PiLockKeyFill className="signup-password-icon" />
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="signup-password"
                placeholder="Password"
                type="password"
              />
            </div>
            <div
              style={{ marginTop: "10px", marginBottom: "10px" }}
              className="signup-password-container"
            >
              <PiLockKeyFill className="signup-password-icon" />
              <input
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="signup-password"
                placeholder="Confirm Password"
                type="password"
              />
            </div>
            {showError && <p className="signup-error-message">{erroMessage}</p>}
            <button className="signup-btn">
              {isUploading ? "uploading..." : "Sign Up"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

//  universityId: req.body.universityId,
//     fullName: req.body.fullName,
//     fieldOfStudy: req.body.fieldOfStudy,
//     username: req.body.username,
//     password: hashedPassword,

export default Signup;
