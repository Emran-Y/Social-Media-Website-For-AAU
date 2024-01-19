const mongoose = require("mongoose");

const jobsAndInternshipsSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    company: { type: String, required: true },
    deadline: { type: String, required: true },
    description: { type: String, required: true },
    picture: {
      type: String,
      required: false,
      default:
        "https://www.thermaxglobal.com/wp-content/uploads/2020/05/image-not-found.jpg",
    },
    link: { type: String, required: true },
  },
  { timestamps: true }
);

const JobsAndInternships = mongoose.model(
  "JobsAndInternships",
  jobsAndInternshipsSchema
);

module.exports = JobsAndInternships;
