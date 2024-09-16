const express = require("express");
const router = express.Router();
const User = require("../Models/User");

// search all users names
router.post("/getUserName/:id", async (req, res) => {
  const { userName } = req.body;
  const { id } = req.params;

  try {
    if (userName && userName.length > 0) {
      // Only search if userName is provided
      const users = await User.find(); // Fetch all users
      const findUser = users.filter(
        (user) =>
          user.firstName
            .toLowerCase()
            .trim()
            .includes(userName.toLowerCase().trim()) ||
          user.LastName.toLowerCase()
            .trim()
            .includes(userName.toLowerCase().trim()) // Corrected lastName casing
      );
      res.status(200).send(findUser); // Return matched users
    } else {
      res.status(200).send([]); // Send an empty array when userName is not provided
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
