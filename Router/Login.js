const express = require("express");
const router = express.Router();
const User = require("../Models/User");

router.post("/splash", async (req, res) => {
  const { Email } = req.body;
  const user = await User.findOne({ Email: Email });
  if (user) {
    res.send(user);
  }
});

// SignIn route
router.post("/signIn", async (req, res) => {
  const { Email, Password } = req.body;
  // Convert the email to lowercase
  const lowerCaseEmail = Email.toLowerCase().trim();

  // Find the email user id
  const findEmailUser = await User.findOne({ Email: lowerCaseEmail });
  if (findEmailUser) {
    if (findEmailUser.Password === Password) {
      res.send(findEmailUser);
    } else {
      res.send("Password is Incorrect");
    }
  } else {
    res.send("Email or Password is Incorrect");
  }
});

// SignUp route
router.post("/signUp", async (req, res) => {
  const {
    First_Name,
    Last_Name,
    Email,
    Password,
    Gender,
    Date_Of_Birth,
    Degree_name,
    Institute_Name,
    State,
    District,
    Nationality,
  } = req.body;

  // Convert the email to lowercase
  const lowerCaseEmail = Email.toLowerCase();

  // Check if the email already exists
  const existMail = await User.findOne({ Email: lowerCaseEmail });
  if (existMail) {
    res.send("Email has Already Been Taken");
  } else {
    const user = await User({
      firstName: First_Name,
      LastName: Last_Name,
      Email: lowerCaseEmail, // Save email in lowercase
      Password: Password,
      Gender: Gender,
      DateOfBirth: Date_Of_Birth,
      Degreename: Degree_name,
      InstitudeName: Institute_Name,
      State: State,
      District: District,
      Nationality: Nationality,
    });
    // Save the user details in signup
    await user.save();
    res.send("SignUp Successfully");
  }
});

// get the user details for update when component refresh
router.post("/getUser", async (req, res) => {
  const { userId } = req.body;
  const user = await User.findById(userId);
  // console.log(userId);
  if (user) {
    // console.log("send");
    res.send(user);
  }
  // console.log("userId", userId);
});

module.exports = router;
