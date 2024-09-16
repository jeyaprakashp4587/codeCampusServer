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

router.post("/signIn", async (req, res) => {
  const { Email, Password } = req.body;
  // find the email user id
  const findEmailUser = await User.findOne({ Email });
  if (findEmailUser) {
    if (findEmailUser.Password === Password) {
      res.send(findEmailUser);
    } else {
      res.send("Password is Incorrect");
    }
  } else {
    res.send("Email or Passowrd is Incorrect");
  }
});

router.post("/signUp", async (req, res) => {
  //
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
  //   check if email already exists
  //
  const existMail = await User.findOne({ Email: Email });
  if (existMail) {
    res.send("Email has Already Taken");
  } else {
    const user = await User({
      firstName: First_Name,
      LastName: Last_Name,
      Email: Email,
      Password: Password,
      Gender: Gender,
      DateOfBirth: Date_Of_Birth,
      Degreename: Degree_name,
      InstitudeName: Institute_Name,
      State: State,
      District: District,
      Nationality: Nationality,
    });
    //  save the user details in signup
    await user.save();
    res.send("SignUp Sucessfully");
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
