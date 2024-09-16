const express = require("express");
const router = express.Router();
const User = require("../Models/User");

//
router.post("/setActitvity/:id", async (req, res) => {
  const { ActivityName, Date } = req.body;
  const { id } = req.params;
  //   find the user
  const user = await User.findById(id);
  if (user) {
    // check exists date
    const existsDate = user.Activities.find((date) => date.date == Date);
    if (!existsDate) {
      user.Activities.push({ date: Date });
      const findDate = user.Activities.find((date) => date.date === Date);
      findDate.activities.push({ activityName: ActivityName });
      await user.save();
    }
    // find the exist date activities
    else {
      existsDate.activities.push({ activityName: ActivityName });
      await user.save();
    }
  }
});
// get the allactivites dates
router.post("/getAllActitvityDates/:id", async (req, res) => {
  const { id } = req.params;
  //   find user
  const user = await User.findById(id);
  if (user) {
    const dates = user.Activities.map((date) => date.date);
    res.send(dates);
  }
});

// get particular date acttivities
router.post("/getParticularDateActitvities/:id", async (req, res) => {
  const { id } = req.params;
  const { Date } = req.body;
  //   find user
  const user = await User.findById(id);
  if (user) {
    const Alldates = user.Activities.find((date) => date.date == Date);
    res.send(Alldates?.activities);
  }
});
//
module.exports = router;
