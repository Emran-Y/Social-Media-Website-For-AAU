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
const http = require("http");
const { Server } = require("socket.io");

app.use(cors());
dotenv.config();
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Connected to MongoDB");

    const server = http.createServer(app);
    const io = new Server(server, {
      cors: {
        origin: "https://aau-connectify.vercel.app",
        methods: ["GET", "POST"],
      },
    });

    io.on("connection", (socket) => {
      console.log("User connected: " + socket.id);
      socket.on("join_room", (data) => {
        socket.join(data);
        console.log("User joined room: " + data);
      });
      socket.on("send_message", (data) => {
        console.log(data);
        socket.to(data.room).emit("receive_message", data.text);
      });
    });

    server.listen(5011, () => {
      console.log("Server is running on port 5011.");
    });
  })
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
