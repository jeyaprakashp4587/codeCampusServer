const express = require("express");
const router = express.Router();
const User = require("../Models/User");

// suggestion for users
router.get("/users/:id", async (req, res) => {
  const { id } = req.params;
  // console.log(id);
  const users = await User.aggregate([{ $sample: { size: 6 } }]);
  const filter = users.filter((user) => user._id != id);
  if (filter.length > 0) {
    res.json(filter);
  }
});

module.exports = router;
