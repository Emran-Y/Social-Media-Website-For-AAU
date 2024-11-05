const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const http = require("http");
const { Server } = require("socket.io");
const swaggerUi = require("swagger-ui-express");
const swaggerFile = require("./swagger-output.json");
const swaggerSpec = require("./swaggerConfig.js");

dotenv.config(); // Load environment variables at the beginning

const app = express();

const userRoute = require("./Routes/user");
const clubRoute = require("./Routes/club");
const announcementRoute = require("./Routes/announcement");
const commentRoute = require("./Routes/comment");
const jobsAndInternshipsRoute = require("./Routes/jobsAndInternships");
const lostAndFoundRoute = require("./Routes/lostAndFound");
const messageRoute = require("./Routes/message");

app.use(cors());
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
  .catch((err) => console.log("Failed to connect to MongoDB:", err));

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

// Swagger UI setup
app.use("/doc", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

