import React from "react";
import { useParams } from "react-router-dom";

function userProfile() {
  const { userId } = useParams();
  const [thisUserData, setThisUserData] = React.useState({}); // [1
  React.useEffect(() => {
    fetch(`http://localhost:5011/api/user/${userId}`, {
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
        setThisUserData(data);
      })
      .catch((error) => {
        console.error("Fetch error:", error);
        // Handle the error as needed
      });
  }, []);
  return (
    <div className="profile-container">
      <div className="profile-1">
        <div className="profile-img-container">
          <img
            src={thisUserData && thisUserData.profilePicture}
            alt=""
            className="profile-img"
          />
        </div>
        <div className="profile-userinfo-container">
          <h2 className="profile-userinfo-name">
            {thisUserData && thisUserData.fullName}
          </h2>
          <p className="profile-userinfo-fieldofstudy">
            {thisUserData && thisUserData.fieldOfStudy}
          </p>
        </div>
      </div>
    </div>
  );
}

export default userProfile;
