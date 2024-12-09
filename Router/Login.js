const express = require("express");
const router = express.Router();
const User = require("../Models/User");
const nodemailer = require("nodemailer");

router.post("/splash", async (req, res) => {
  const { Email } = req.body;
  if (!Email) {
    return res.status(400).json({ error: "Email is required" });
  }
  // console.log("Received email:", Email);
  try {
    const user = await User.findOne({ Email: Email });
    if (user) {
      return res.status(200).json({user: user}); // Respond with the user
    } else {
      console.log("User not found");
      return res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error("Error querying the database:", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
});


// SignIn route
router.post("/signIn", async (req, res) => {
  const { Email, Password } = req.body;
  // Convert the email to lowercase
  const lowerCaseEmail = Email.toLowerCase().trim();
  //  console.log(Email,Password);
   
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
  const lowerCaseEmail = Email.toLowerCase().trim();
  const lowerGender = Gender.toLowerCase().trim();

  // Check if the email already exists
  const existMail = await User.findOne({ Email: Email });
  if (existMail) {
    res.send("Email has Already Been Taken");
  } else {
    const user = await User({
      firstName: First_Name,
      LastName: Last_Name,
      Email: lowerCaseEmail, // Save email in lowercase
      Password: Password,
      Gender: lowerGender,
      DateOfBirth: Date_Of_Birth,
      Degreename: Degree_name,
      InstitudeName: Institute_Name,
      State: State,
      District: District,
      Nationality: Nationality,
    });
    // Save the user details in signup
    await user.save();
    // create node mailer for welcome message
    const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'jeyaprakashp431@gmail.com',
      pass: 'qiri pwwh hcyn nrek ', // Use App Password here if using Gmail
    },
  });

  // Compose email
 const mailOptions = {
  from: 'jeyaprakashp431@gmail.com',
  to: lowerCaseEmail,
  subject: 'Welcome to CodeZAck!',
  html: `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <h1 style="color: #4CAF50;">Welcome to CodeZAck, ${First_Name}!</h1>
      <p>Thank you for signing up for <strong>CodeZAck</strong>, the ultimate learning hub for coding enthusiasts like you.</p>
      <h2>About CodeZAck</h2>
      <p>At CodeZAck, we aim to make learning programming languages and software development both fun and accessible. Whether you're a beginner or an expert, you'll find something here for you!</p>
      <h3>Here’s what you can explore:</h3>
      <ul>
        <li><strong>Learn to Code:</strong> Comprehensive tutorials for front-end, back-end, and app development.</li>
        <li><strong>Take Challenges:</strong> Test your skills with coding challenges across various levels.</li>
        <li><strong>Socialize:</strong> Share your achievements, connect with friends, and get inspired by others.</li>
        <li><strong>Job Placements:</strong> Stay updated with job opportunities and placement tips (coming soon).</li>
      </ul>
      <h3>Get Started</h3>
      <p>Log in now and dive into the world of coding. Let’s embark on this exciting journey together!</p>
      <p>If you have any questions, feel free to contact us anytime. We're here to help.</p>
      <p style="margin-top: 20px;">Happy Coding!<br><strong>The CodeZAck Team</strong></p>
    </div>
    `,
   };
    await transporter.sendMail(mailOptions);
    // 
    res.json({ message:"SignUp Sucessfully",user:user});
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
// send resetPass otp
router.post("/sendReserPassOtp", async (req, res) => {
  const { email, otp } = req.body;
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'jeyaprakashp431@gmail.com',
      pass: 'qiri pwwh hcyn nrek', // Use App Password here if using Gmail
    },
  });
  // Compose email
  const mailOptions = {
    from: 'jeyaprakashp431@gmail.com',
    to: email,
    subject: 'Password Reset Request',
    html: `
      
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
        <h2 style="text-align: center; color: #3a6ea5;">Password Reset Request</h2>
        <p style="font-size: 16px; color: #333;">
          Dear User,
        </p>
        <p style="font-size: 16px; color: #333;">
          We received a request to reset your password. Please use the OTP below to proceed with resetting your password. This OTP is valid for the next 10 minutes.
        </p>
        <div style="text-align: center;display:flex;">
          <p>
          OTP:</p>
          <p style="font-Weight: bold;padding-left:5px;">${otp}</p>
        </div>
        <p style="font-size: 16px; color: #333;">
          If you did not request a password reset, please ignore this email or contact our support team.
        </p>
        <p style="font-size: 16px; color: #333;">Thank you,</p>
        <p style="font-size: 16px; color: #333; font-weight: bold;">The Support Team</p>
        <hr style="border: 0; border-top: 1px solid #ddd; margin: 20px 0;">
        <p style="font-size: 12px; color: #999; text-align: center;">
          If you have any questions, please do not hesitate to contact us at support@example.com.
        </p>
      </div>
    `,
  };
  try {
    await transporter.sendMail(mailOptions);
    res.status(200).send({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error.message);
    res.status(500).send({ error: "Failed to send OTP" });
  }
});
//reset New password
router.post('/resetNewPassword', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }
  try {
    // Find the user by email
    const user = await User.findOne({Email: email})
    // console.log(user);
    
    if (!user) {
      console.log("no user found");
      return res.status(404).json({ message: 'User not found.' });
    }
    else {
      user.Password = password;
      await user.save();
      return res.status(200).json({msg:'ok'});
    }
  } catch (error) {
    console.log(err);
    
  }
})
module.exports = router;
