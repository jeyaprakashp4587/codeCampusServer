const express = require("express");
const router = express.Router();
const User = require("../Models/User");
let userID;
router.post("/addCourse", async (req, res) => {
  const { courseName, userId } = req.body;
  userID = userId;
  const user = await User.findById(userId);
  //   console.log(user);
  if (user) {
    //  check if the coursename is already exists
    const ExistsCourseName = user.Courses.find(
      (course) => course.Course_Name === courseName
    );
    if (ExistsCourseName) {
      res.send("You Are All Ready Enrolled For This Course");
    } else {
      user.Courses.push({ Course_Name: courseName, Technologies: [] });
      await user.save();
      res.send(user);
    }
  }
});
router.post("/addTech", async (req, res) => {
  const { TechName, CourseName, UserId } = req.body;
  const user = await User.findById(UserId);
  if (user) {
    // find the CoursName object
    const course = user.Courses.find(
      (course) => course.Course_Name === CourseName
    );
    // // check if the Tech is already exists
    const ExistsTech = course.Technologies.some(
      (tech) => tech.TechName === TechName
    );
    if (ExistsTech) {
      res.send("you Already Enrolled For This Technologie");
    } else {
      course.Technologies.push({ TechName: TechName, Points: 0 });
      res.send(user);
      await user.save();
    }
  }
});
// remove course
router.post("/removeCourse", async (req, res) => {
  const { userId, CourseName } = req.body;
  // console.log(CourseName, userId);
  // find the userid
  const user = await User.findById(userId);
  if (user) {
    const remove = user.Courses.findIndex(
      (course) => course.Course_Name === CourseName
    );
    if (remove !== -1) {
      user.Courses.splice(remove, 1);
    }
    await user.save();
    res.send(user);
  }
});

module.exports = router;
