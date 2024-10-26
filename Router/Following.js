const express = require("express");
const router = express.Router();
const User = require("../Models/User");

// Find existing connection
router.post("/findExistsConnection", async (req, res) => {
  try {
    const { ConnectionId, userId } = req.body;

    // Use projection to limit the data retrieved from the database
    const user = await User.findById(userId).select("Connections").lean();

    if (!user) {
      return res.status(404).send("User not found");
    }

    // Use 'some' for better performance when checking existence
    const findExists = user.Connections.some(
      (connection) => connection.ConnectionsdId == ConnectionId
    );

    if (findExists) {
      res.send("Yes");
    } else {
      res.send("No");
    }
  } catch (error) {
    res.status(500).send("Error finding connection");
  }
});

// Add connection
router.post("/addConnection", async (req, res) => {
  try {
    const { ConnectionId, userId } = req.body;

    // Use projection to limit the data retrieved from the database
    const user = await User.findById(userId).select("Connections");

    if (!user) {
      return res.status(404).send("User not found");
    }

    // Check if the connection already exists to avoid duplicates
    const connectionExists = user.Connections.some(
      (connection) => connection.ConnectionsdId == ConnectionId
    );

    if (connectionExists) {
      return res.status(400).send("Connection already exists");
    }

    // Push the new connection
    user.Connections.push({ ConnectionsdId: ConnectionId });

    await user.save();
    res.send("Sucess");
  } catch (error) {
    res.status(500).send("Error adding connection");
  }
});

// Remove connection
router.post("/removeConnection/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { ConnectionId } = req.body;

    // Use projection to limit the data retrieved from the database
    const user = await User.findById(id).select("Connections");

    if (!user) {
      return res.status(404).send("User not found");
    }

    // Filter out the connection to remove
    const updatedConnections = user.Connections.filter(
      (connection) => connection.ConnectionsdId != ConnectionId
    );

    if (updatedConnections.length === user.Connections.length) {
      return res.status(400).send("Connection not found");
    }

    user.Connections = updatedConnections;
    await user.save();
    res.send("Done");
  } catch (error) {
    res.status(500).send("Error removing connection");
  }
});

module.exports = router;
