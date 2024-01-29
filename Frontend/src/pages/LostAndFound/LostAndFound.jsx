import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import "./LostAndFound.css";
import { format } from "timeago.js";

function LostAndFound() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    picture: "",
  });
  const [lostAndFoundItems, setLostAndFoundItems] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoaded, setIsLoaded] = useState(true);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    if (!userData) {
      // Redirect to login if user data is not available
      navigate("/login");
    } else {
      setIsAdmin(userData.isAdmin);

      // Fetch lost and found items
      fetch("http://localhost:5011/api/lostAndFound", {
        headers: {
          Authorization: `Bearer ${
            JSON.parse(localStorage.getItem("userData")) &&
            JSON.parse(localStorage.getItem("userData")).token
          }`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setLostAndFoundItems(data);
          setIsLoaded(false);
        })
        .catch((error) => {
          console.error("Error fetching lost and found items:", error);
        });
    }
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (formData.title === "" || formData.description === "") {
      alert("Please fill in the required fields");
      return;
    }

    // Your code for handling the form submission goes here
    console.log("Form data submitted:", formData);
    fetch("http://localhost:5011/api/lostAndFound/post", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${
          JSON.parse(localStorage.getItem("userData")) &&
          JSON.parse(localStorage.getItem("userData")).token
        }`,
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
        setLostAndFoundItems([data, ...lostAndFoundItems]);
      })
      .catch((error) => {
        console.error("Error:", error);
      });

    setFormData({
      title: "",
      description: "",
      picture: "",
    });
  };

  return (
    <div className="lostandfound-page">
      <div className="lostandfound-admin">
        {isAdmin && (
          <form className="lostandfound-form" onSubmit={handleSubmit}>
            <label className="lostandfound-label">
              Title:
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="lostandfound-input"
                required
              />
            </label>

            <label className="lostandfound-label">
              Description:
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="lostandfound-textarea"
                required
              />
            </label>

            <label className="lostandfound-label">
              Picture (Optional):
              <input
                type="url"
                name="picture"
                value={formData.picture}
                onChange={handleInputChange}
                className="lostandfound-input"
              />
            </label>

            <button type="submit" className="lostandfound-button">
              Submit
            </button>
          </form>
        )}
      </div>
      <div className="lostandfound-items">
        {isLoaded ? (
          <div className="nice-spinner"></div>
        ) : (
          lostAndFoundItems &&
          lostAndFoundItems.map((item) => (
            <div key={item._id} className="lostandfound-card">
              <div className="lostandfound-card-header">
                <h2 className="lostandfound-card-title">{item.title}</h2>
                <p className="lostandfound-card-date">
                  {format(item.updatedAt)}
                </p>
              </div>
              <img
                src={item.picture}
                alt="Lost and Found"
                className="lostandfound-card-image"
              />
              <p className="lostandfound-card-description">
                {item.description}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default LostAndFound;
