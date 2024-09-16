const express = require("express");
const http = require("http");
const cors = require("cors");
const bodyParser = require("body-parser");
const { DB2 } = require("./Database/DB");
const { DB1 } = require("./Database/CCDB");
const LogIn = require("./Router/Login");
const Course = require("./Router/Course");
const Challenges = require("./Router/Challenges");
const Profile = require("./Router/Profile");
const Post = require("./Router/Post");
const Search = require("./Router/Search");
const Following = require("./Router/Following");
const Suggestions = require("./Router/Suggestions");
const Socket = require("socket.io");
const Actitivity = require("./Router/Activity");
const Notification = require("./Router/Notification");
const Placement = require("./Router/Placement");
const socket = require("./Socket/Socket");

const app = express();
const server = http.createServer(app);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({ origin: "*" }));
// socket
socket(server);
// Connect databases
DB1.on("connected", () => {
  console.log("DB1 is connected");
});

DB2.on("connected", () => {
  console.log("DB2 is connected");
});

// Routers
app.use("/LogIn", LogIn);
app.use("/Courses", Course);
app.use("/Challenges", Challenges);
app.use("/Profile", Profile);
app.use("/Post", Post);
app.use("/Activity", Actitivity);
app.use("/Search", Search);
app.use("/following", Following);
app.use("/Suggestions", Suggestions);
app.use("/Placements", Placement);
app.use("/Notifications", Notification);

// Port listening
const port = process.env.PORT || 8080;
server.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
