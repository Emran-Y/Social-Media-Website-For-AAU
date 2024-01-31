// JobsAndInternships.js

import React, { useState, useEffect } from "react";
import "./JobsAndInternships.css";
import { useNavigate } from "react-router-dom";
import { format } from "timeago.js";

function JobsAndInternships() {
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    link: "",
    description: "",
    deadline: "",
  });
  const navigate = useNavigate();
  const [jobsAndInternships, setJobsAndInternships] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoaded, setIsLoaded] = useState(true);

  const [profilePicture, setProfilePicture] = React.useState("");
  const [isUploading, setIsUploading] = React.useState(false);

  const [currentEditingJob, setCurrentEditingJob] = useState("");

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    if (!userData) {
      navigate("/");
    } else {
      setIsAdmin(userData.isAdmin);

      // Fetch jobs and internships
      fetch("http://localhost:5011/api/jobsAndInternships", {
        headers: {
          Authorization: `Bearer ${
            JSON.parse(localStorage.getItem("userData")) &&
            JSON.parse(localStorage.getItem("userData")).token
          }`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setJobsAndInternships(data);
          setIsLoaded(false);
        })
        .catch((error) => {
          console.error("Error fetching jobs and internships:", error);
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
    if (
      formData.title === "" ||
      formData.company === "" ||
      formData.link === "" ||
      formData.description === "" ||
      formData.deadline === ""
    ) {
      alert("Please fill all the fields");
      return;
    }

    // Your code for handling the form submission goes here
    console.log("Form data submitted:", formData);
    fetch("http://localhost:5011/api/jobsAndInternships/post", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${
          JSON.parse(localStorage.getItem("userData")) &&
          JSON.parse(localStorage.getItem("userData")).token
        }`,
      },
      body: JSON.stringify({ ...formData, picture: profilePicture }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
        setJobsAndInternships([data, ...jobsAndInternships]);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
    setFormData({
      title: "",
      company: "",
      link: "",
      description: "",
      deadline: "",
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

  const handleDelete = (id) => {
    fetch(`http://localhost:5011/api/jobsAndInternships/delete/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${
          JSON.parse(localStorage.getItem("userData")) &&
          JSON.parse(localStorage.getItem("userData")).token
        }`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
        setJobsAndInternships((prevData) =>
          prevData.filter((item) => item._id !== id)
        );
      })
      .catch((error) => {
        console.error("Error deleting job or internship:", error);
      });
  };

  const handleUpdate = (id) => {
    if (
      !formData.title &&
      !formData.company &&
      !formData.link &&
      !formData.deadline &&
      !profilePicture
    ) {
      alert("please fill at least one data");
      return;
    }
    const updatedJob = {
      title: formData.title !== "" ? formData.title : undefined,
      company: formData.company !== "" ? formData.company : undefined,
      link: formData.link !== "" ? formData.link : undefined,
      description:
        formData.description !== "" ? formData.description : undefined,
      deadline: formData.deadline !== "" ? formData.deadline : undefined,
      picture: profilePicture !== "" ? profilePicture : undefined,
    };

    fetch(`http://localhost:5011/api/jobsAndInternships/update/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${
          JSON.parse(localStorage.getItem("userData")) &&
          JSON.parse(localStorage.getItem("userData")).token
        }`,
      },
      body: JSON.stringify(updatedJob),
    })
      .then((response) => response.json())
      .then((data) => {
        setJobsAndInternships(
          jobsAndInternships.map((job) =>
            job._id === id ? { ...job, ...data } : job
          )
        );
        setFormData({
          title: "",
          company: "",
          link: "",
          description: "",
          deadline: "",
        });
        setProfilePicture("");
        setCurrentEditingJob("");
      })
      .catch((error) => {
        console.error("Error updating job or internship:", error);
      });
  };

  return (
    <div className="jobsandinternships-page">
      <div className="jobsandinternships-admin">
        {isAdmin && (
          <form className="jobsandinternships-form" onSubmit={handleSubmit}>
            <label className="jobsandinternships-label">
              Title:
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="jobsandinternships-input"
                required
              />
            </label>

            <label className="jobsandinternships-label">
              Company:
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleInputChange}
                className="jobsandinternships-input"
                required
              />
            </label>

            <label className="jobsandinternships-label">
              Link:
              <input
                type="url"
                name="link"
                value={formData.link}
                onChange={handleInputChange}
                className="jobsandinternships-input"
                required
              />
            </label>

            <label className="jobsandinternships-label">
              Description:
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="jobsandinternships-textarea"
                required
              />
            </label>

            <label className="jobsandinternships-label">
              Deadline:
              <input
                type="date"
                name="deadline"
                value={formData.deadline}
                onChange={handleInputChange}
                className="jobsandinternships-input"
                required
              />
            </label>

            <label className="jobsandinternships-label">
              Picture (Optional):
              <input
                type="file"
                name="picture"
                onChange={(e) => handleFileChange(e.target.files[0])}
                className="jobsandinternships-input"
              />
            </label>

            <button type="submit" className="jobsandinternships-button">
              {isUploading ? "Uploading..." : "Submit"}
            </button>
          </form>
        )}
      </div>
      <div className="jobsandinternships-posts">
        {isLoaded ? (
          <div className="nice-spinner"></div>
        ) : (
          jobsAndInternships.map((jobOrInternship) => (
            <div key={jobOrInternship._id} className="jobsandinternships-card">
              <h2 className="jobsandinternships-card-title">
                {jobOrInternship.title} | {jobOrInternship.company}
              </h2>
              <div className="jobsandinternships-card-middle">
                <img
                  src={jobOrInternship.picture}
                  alt="jobs and internships image"
                  className="jobsandinternships-card-img"
                />
                <p className="jobsandinternships-card-desc">
                  {jobOrInternship.description}
                </p>
              </div>
              {isAdmin && (
                <div className="jobsandinternships-change-maker-button">
                  <button
                    onClick={() => {
                      handleUpdate(jobOrInternship._id);
                    }}
                    className="jobsandinternships-update-button"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => handleDelete(jobOrInternship._id)}
                    className="jobsandinternships-delete-button"
                  >
                    Delete
                  </button>
                </div>
              )}
              <div className="jobsandinternships-card-bottom">
                <p className="jobsandinternships-card-date">
                  Deadline: {jobOrInternship.deadline}
                </p>
                <a
                  className="jobsandinternships-card-link"
                  href={jobOrInternship.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Apply
                </a>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default JobsAndInternships;
