import React from "react";
import "./userClubs.css";
import { useNavigate } from "react-router-dom";

function UserClubs() {
  const navigate = useNavigate();
  const [availableClubs, setAvailableClubs] = React.useState([]);
  const [sentJoinRequests, setSentJoinRequests] = React.useState([]);
  const [lodded, setLodded] = React.useState(false);

  React.useEffect(() => {
    fetch("http://localhost:5011/api/club/pendingClubRequests", {
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
        const sentRequests = data.map((req) => req._id);
        setSentJoinRequests(sentRequests);
      })
      .catch((error) => {
        console.error("Fetch error:", error);
        // Handle the error as needed
      });

    fetch("http://localhost:5011/api/club/allClubs", {
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
        setLodded(true);
        console.log(data);
        setAvailableClubs(data);
      })
      .catch((error) => {
        console.error("Fetch error:", error);
        // Handle the error as needed
      });
  }, []);

  const handleApply = (clubId) => {
    fetch(`http://localhost:5011/api/club/sendClubJoinRequest/${clubId}`, {
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
        const newSentRequests = [...sentJoinRequests, clubId];
        setSentJoinRequests(newSentRequests);
      })
      .catch((error) => {
        console.error("Fetch error:", error);
        // Handle the error as needed
      });
  };

  return (
    <div className="availableClubs-container">
      {lodded ? (
        availableClubs.length === 0 ? (
          <div
            style={{ marginLeft: "auto", marginRight: "auto" }}
            className="clubadminpendings-card"
          >
            <p
              style={{ textAlign: "center" }}
              className="clubadminpendings-username"
            >
              You are already member of all clubs!
            </p>
          </div>
        ) : (
          availableClubs.map((club) => (
            <div key={club._id} className="availableClubs-card">
              <h3 className="availableClubs-clubName">{club.clubName}</h3>
              <button
                className={`availableClubs-applyButton ${
                  sentJoinRequests.includes(club._id) ? "pending" : ""
                }`}
                onClick={() => handleApply(club._id)}
                disabled={sentJoinRequests.includes(club._id)}
              >
                {sentJoinRequests.includes(club._id) ? "Pending" : "Apply"}
              </button>
            </div>
          ))
        )
      ) : (
        <div className="nice-spinner"></div>
      )}
    </div>
  );
}

export default UserClubs;
