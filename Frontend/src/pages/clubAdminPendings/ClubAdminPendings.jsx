import React from "react";
import "./clubAdminPendings.css";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import backend_url from "../../backend";

function ClubAdminPendings() {
  const [pendings, setPendings] = React.useState([]); // [pending1, pending2, pending3
  const navigate = useNavigate();

  const handleAccept = (userId) => {
    fetch(`${backend_url}/api/club/acceptClubJoinRequest/${userId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${
          JSON.parse(localStorage.getItem("userData")) &&
          JSON.parse(localStorage.getItem("userData")).token
        }`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setPendings(pendings.filter((pending) => pending._id !== userId));
      })
      .catch((error) => {
        console.error("Fetch error:", error);
        // Handle the error as needed
      });
  };

  React.useEffect(() => {
    if (!localStorage.getItem("userData")) {
      navigate("/login");
    }
  }, []);

  React.useEffect(() => {
    fetch(`${backend_url}/api/club/fetchAllPendingClubRequests`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${
          JSON.parse(localStorage.getItem("userData")) &&
          JSON.parse(localStorage.getItem("userData")).token
        }`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setPendings(data);
      })
      .catch((error) => {
        console.error("Fetch error:", error);
        // Handle the error as needed
      });
  }, []);

  return (
    <div className="clubadminpendings-container">
      {pendings.length > 0 ? (
        pendings.map((pending) => (
          <div key={pending.userId} className="clubadminpendings-card">
            <Link
              to={`/profile/${pending._id}`}
              className="clubadminpendings-username"
            >
              {pending.fullName}
            </Link>
            <button
              className="clubadminpendings-acceptButton"
              onClick={() => handleAccept(pending._id)}
            >
              Accept
            </button>
          </div>
        ))
      ) : (
        <div className="clubadminpendings-card">
          <p className="clubadminpendings-username">No Pending Requests</p>
        </div>
      )}
    </div>
  );
}

export default ClubAdminPendings;
