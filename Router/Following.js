const express = require("express");
const router = express.Router();
const User = require("../Models/User");

// find the exist follower
router.post("/findExistsConnection", async (req, res) => {
  const { ConnectionId, userId } = req.body;
  //   find user
  const user = await User.findById(userId);
  if (user) {
    const findExists = user.Connections.find(
      (connection) => connection.ConnectionsdId == ConnectionId
    );
    if (findExists) {
      res.send("Yes");
    } else {
      res.send("No");
    }
  }
});

router.post("/addConnection", async (req, res) => {
  const { ConnectionId, userId } = req.body;
  //   console.log(ConnectionId, userId);
  const user = await User.findById(userId);
  if (user) {
    user.Connections.push({ ConnectionsdId: ConnectionId });
    await user.save();
    res.send("Sucess");
  }
});

// remove followers
router.post("/removeConnection/:id", async (req, res) => {
  const { id } = req.params;
  const { ConnectionId } = req.body;
  // find user
  const user = await User.findById(id);
  if (user) {
    user.Connections = user.Connections.filter(
      (connection) => connection.ConnectionsdId != ConnectionId
    );
    await user.save();
    res.send("Done");
  }
});

module.exports = router;
