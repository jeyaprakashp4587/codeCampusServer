const express = require("express");
const http = require("http");
const router = require("router");
const cors = require("cors");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const { DB2 } = require("./Database/DB");
const { DB1 } = require("./Database/CCDB");
const LogIn = require("./Router/Login");
const Course = require("./Router/Course");
const Challenges = require("./Router/Challenges");
const Profile = require("./Router/Profile");
const Socket = require("socket.io");
const { log } = require("console");
const server = http.createServer(app);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
// connect database
// DB1 means App Database
DB1.on("connected", () => {
  console.log("DB1 is connected");
});
// DB2 means user DataBase
DB2.on("connected", () => {
  console.log("DB2 is connected");
});
// socket
const io = Socket(server, {
  cors: {
    origin: "*",
    method: ["GET,POST"],
  },
});
io.on("connection", (socket) => {
  console.log("socket connect", socket.id);
});
// socket
// reauest the all routers
app.use("/LogIn", LogIn);
app.use("/Courses", Course);
app.use("/Challenges", Challenges);
app.use("/Profile", Profile);
// port listening
const port = process.env.PORT || 8080;
server.listen(port, () => {
  console.log(`server is listening on port ${port}`);
});
//KOuDbfkcGShd3way
