const express = require("express");
const router = express.Router();
const User = require("../Models/User");

router.get("/getNotifications/:userId", async (req, res) => {
  const { userId } = req.params;
  const user = await User.findById(userId);
  if (user) {
    res.send(user.Notifications);
  }
});
// ---
// PATCH request to mark a notification as seen
router.patch("/markAsSeen/:userId/:notificationId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (user) {
      const notificationIndex = user.Notifications.findIndex(
        (notification) =>
          notification._id.toString() === req.params.notificationId
      );
      if (notificationIndex !== -1) {
        user.Notifications[notificationIndex].seen = true;
        await user.save();
        res.send(user.Notifications[notificationIndex]);
      } else {
        res.status(404).send({ message: "Notification not found" });
      }
    } else {
      res.status(404).send({ message: "User not found" });
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

// ---- //
module.exports = router;
