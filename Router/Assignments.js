const express = require("express");
const router = express.Router();
const User = require("../Models/User");
const { DB1 } = require("../Database/CCDB");

//
router.get("/getAssignments/:assignmentTye", async (req, res) => {
  const { assignmentTye } = req.params;
  // console.log(assignmentTye);
  const collection = DB1.collection("Quiz");
  const findAssignment = await collection.findOne({
    AssignmentType: assignmentTye,
  });
  //   console.log(findAssignment);
  res.send(findAssignment.Quiz);
});

// save the assignment
router.post("/saveAssignment/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { AssignmentType, point, level } = req.body;
    // console.log(AssignmentType, point, level);
    // Find user by ID
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // Check if the assignment already exists in the user's assignments
    let assignment = user.Assignments.find(
      (a) => a.AssignmentType === AssignmentType
    );
    if (assignment) {
      // If assignment exists, update the points and level for that assignment
      assignment.AssignmentLevel.push({
        LevelType: level,
        point: point,
      });
    } else {
      // If assignment doesn't exist, create a new one
      user.Assignments.push({
        AssignmentType: AssignmentType,
        AssignmentLevel: [
          {
            LevelType: level,
            point: point,
          },
        ],
      });
    }
  // Increment user course points
const course = user.Courses.find((course) =>
  course.Technologies.some(
    (tech) => tech.TechName.toLowerCase() === AssignmentType.toLowerCase()
  )
);
// increase user course points
if (course) {
  const tech = course.Technologies.find(
    (tech) => tech.TechName.toLowerCase() === AssignmentType.toLowerCase()
  );
  if (tech) {
    switch (level) {
      case "easy":
        tech.Points += 2;
        break;
      case "medium":
        tech.Points += 3;
        break;
      case "hard":
        tech.Points += 5;
        break;
    }
  }
}
    // Save the updated user data
    await user.save();
    // Send success response
    res.send(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
