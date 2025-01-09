const express = require("express");
const router = express.Router();
const User = require("../Models/User");

// Set a new activity for a user
router.post("/setActivity/:id", async (req, res) => {
  const { ActivityName, Date } = req.body;
  const { id } = req.params;

  try {
    const result = await User.findOneAndUpdate(
      { _id: id, "Activities.date": Date },
      {
        $setOnInsert: { _id: id },
        $push: {
          "Activities.$[element].activities": { activityName: ActivityName },
        },
      },
      {
        new: true,
        upsert: true,
        arrayFilters: [{ "element.date": Date }],
      }
    );

    if (result) {
      res.send("Activity added successfully");
    } else {
      // If date is not found, insert a new activity entry
      await User.updateOne(
        { _id: id },
        {
          $push: {
            Activities: {
              date: Date,
              activities: [{ activityName: ActivityName }],
            },
          },
        }
      );
      res.send("Activity added successfully");
    }
  } catch (error) {
    res.status(500).send("Server error: " + error.message);
  }
});

// Get all activity dates for a user
router.get("/getAllActivityDates/:id", async (req, res) => {
  const { id } = req.params;
//  console.log(id);
 
  try {
    const user = await User.findById(id, "Activities.date");
    if (user) {
      const dates = user.Activities.map((activity) => activity.date);
      // console.log(dates);
      
      res.send(dates);
    } else {
      res.status(404).send("User not found");
    }
  } catch (error) {
    res.status(500).send("Server error: " + error.message);
  }
});

// Get activities for a particular date
router.post("/getParticularDateActivities/:id", async (req, res) => {
  const { id } = req.params;
  const { Date } = req.body;

  try {
    const user = await User.findOne(
      { _id: id, "Activities.date": Date },
      { "Activities.$": 1 }
    );

    if (user && user.Activities.length > 0) {
      res.send(user.Activities[0].activities);
    } else {
      res.status(404).send("No activities found for this date");
    }
  } catch (error) {
    res.status(500).send("Server error: " + error.message);
  }
});

module.exports = router;
