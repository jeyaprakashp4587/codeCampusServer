const express = require("express");
const router = express.Router();
const User = require("../Models/User");

// Suggestion for users excluding connected users
router.get("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Find the current user and get their connections
    const currentUser = await User.findById(id).select("Connections").lean();

    if (!currentUser) {
      return res.status(404).send("User not found");
    }

    // Get random users (limit 6) with specific fields
    const users = await User.aggregate([
      { $sample: { size: 6 } },
      {
        $project: {
          _id: 1, // Include userId
          firstName: 1,
          LastName: 1,
          InstitudeName: 1,
          "Images.coverImg": 1,
          "Images.profile": 1
         
        },
      },
    ]);

    // Filter users who are not already connected
    const suggestedUsers = users.filter(
      (user) =>
        user._id.toString() !== id &&
        !currentUser.Connections.some(
          (connection) => connection.ConnectionsdId == user._id.toString()
        )
    );

    if (suggestedUsers.length > 0) {
      res.json(suggestedUsers);
    } else {
      res.json([]); // If no suggestions, return an empty array
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving user suggestions");
  }
});


module.exports = router;
