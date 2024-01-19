const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();
const dotenv = require("dotenv");
const userRoute = require("./Routes/user");
const clubRoute = require("./Routes/club");
const announcementRoute = require("./Routes/announcement");
const commentRoute = require("./Routes/comment");
const jobsAndInternshipsRoute = require("./Routes/jobsAndInternships");
const lostAndFoundRoute = require("./Routes/lostAndFound");
const messageRoute = require("./Routes/message");

app.use(cors());
dotenv.config();
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URL)
  .then(console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/user", userRoute);
app.use("/api/club", clubRoute);
app.use("/api/announcement", announcementRoute);
app.use("/api/comment", commentRoute);
app.use("/api/jobsAndInternships", jobsAndInternshipsRoute);
app.use("/api/lostAndFound", lostAndFoundRoute);
app.use("/api/message", messageRoute);

app.listen(5011, () => {
  console.log("Server is running on port 5011.");
});
