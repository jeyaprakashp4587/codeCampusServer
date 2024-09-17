const express = require("express");
const router = express.Router();
const User = require("../Models/User");

// upload user profile and cover photo
router.post("/updateProfileImages", async (req, res) => {
  const { ImageUri, ImageType, userId } = req.body;
  try {
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
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});
// update user name and
router.post("/updateProfileData/:id", async (req, res) => {
  const { FirstName, LastName, Bio } = req.body;
  const { id } = req.params;
  // console.log(FirstName, LastName, Bio);
  const user = await User.findById(id);
  if (user) {
    if (FirstName) user.firstName = FirstName;
    if (LastName) user.LastName = LastName;
    if (Bio) user.Bio = Bio;
    await user.save();
    res.send(user);
  }
});
//
router.post("/setProfile/:id", async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);
  if (!user.Images.profile) {
    console.log(user.Images.profile);
    user.Images.profile =
      user.Gender.toString() == "male"
        ? "https://i.ibb.co/hBjSQLy/boy.png"
        : "https://i.ibb.co/51W8TcQ/woman.png";
    await user.save();
    res.send(user);
  }
});

module.exports = router;
