const express = require("express");
const router = express.Router();
const User = require("../Models/User");

// Upload user profile and cover photo
router.post("/updateProfileImages", async (req, res) => {
  const { ImageUri, ImageType, userId } = req.body;

  try {
    if (!ImageUri || !ImageType || !userId) {
      return res.status(400).json({ error: "Invalid request data" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (ImageType === "profile") {
      user.Images.profile = ImageUri;
    } else if (ImageType === "cover") {
      user.Images.coverImg = ImageUri;
    } else {
      return res.status(400).json({ error: "Invalid ImageType" });
    }

    await user.save();
    return res.status(200).json({ data: user.Images });
  } catch (error) {
    console.error("Error updating profile images:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Update user profile data (name, bio)
router.post("/updateProfileData/:id", async (req, res) => {
  const { FirstName, LastName, Bio } = req.body;
  const { id } = req.params;

  try {
    if (!id) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    let updated = false;

    if (FirstName) {
      user.firstName = FirstName;
      updated = true;
    }
    if (LastName) {
      user.LastName = LastName;
      updated = true;
    }
    if (Bio) {
      user.Bio = Bio;
      updated = true;
    }

    if (updated) {
      await user.save();
    }

    return res.status(200).json({
      firstName: user.firstName,
      LastName: user.LastName,
      Bio: user.Bio,
    });
  } catch (error) {
    console.error("Error updating profile data:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

const coverImages = [
  "https://i.ibb.co/d0dBtHy/2148430879.jpg", 
  "https://i.ibb.co/sKGscq7/129728.jpg"
];
// set profile and cover image
router.post("/setProfile/:id", async (req, res) => {
  const { id } = req.params;
  try {
    if (!id) {
      return res.status(400).json({ error: "Invalid user ID" });
    }
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    // Ensure Images object exists
    if (!user.Images) {
      user.Images = {};
    }
    // Set profile image if not set
    if (!user.Images.profile) {
      user.Images.profile =
        user.Gender.toLowerCase() === "male"
          ? "https://i.ibb.co/hBjSQLy/boy.png"
          : "https://i.ibb.co/51W8TcQ/woman.png";
    }
    // Set cover image if not set
    if (!user.Images.coverImg) {
      user.Images.coverImg = coverImages[Math.floor(Math.random() * coverImages.length)];
    }
    // Save the user once, after updating images
    await user.save();
    return res.status(200).json({ Images: user.Images });
  } catch (error) {
    console.error("Error setting default profile image:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});


// Save FCM token
router.post("/saveFcmToken", async (req, res) => {
  const { userId, FcmToken } = req.body;

  try {
    if (!userId || !FcmToken) {
      return res.status(400).json({ error: "Invalid request data" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.FcmId !== FcmToken) {
      user.FcmId = FcmToken;
      await user.save();
    }

    return res.status(200).send({ message: "FCM token saved successfully" });
  } catch (error) {
    console.error("Error saving FCM token:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
