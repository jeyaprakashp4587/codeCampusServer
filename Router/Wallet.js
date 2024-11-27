const express = require("express");
const router = express.Router();
const User = require("../Models/User");
const nodemailer = require("nodemailer")
const moment = require("moment");


router.post("/ChangeGpayDetails/:id", async (req, res) => { 
    const { id } = req.params;
    const { GpayAccountName, GpayUpiId } = req.body;
    console.log(GpayAccountName, GpayUpiId );
    
    const user = await User.findById(id);
    if (user) {
        user.Wallet.GpayAccount.GpayAccountName = GpayAccountName;
        user.Wallet.GpayAccount.GpayUpiId = GpayUpiId
        if (user.Wallet.TotalWallet <= 0 || !user.Wallet.TotalWallet) {
            user.Wallet.TotalWallet = 0;
        }
        await user.save();
        res.status(200).send(user);
    }
})
// add wallet
router.post("/AddWallet/:id", async (req, res) => {
    const { id } = req.params;
    const { Price } = req.body;
  const user = await User.findById(id);
  // console.log(Price);
  // 
    if (user) {
        user.Wallet.TotalWallet += Price;
        await user.save()
        res.status(200).send(user);
    }
    else {
        res.send("user not found")
    }
})
router.post('/withdrawal', async (req, res) => {
  const { userId, userName, accountName, upiId, amount } = req.body;
  // console.log(userId, userName, accountName, upiId, amount);
  // Configure your email transporter (example using Gmail SMTP)
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
    to: 'pjeya8080@gmail.com',
    subject: 'New Withdrawal Request',
    html: `
      <p>User ID: ${userId}</p>
      <p>User Name: ${userName}</p>
      <p>Account Name: ${accountName}</p>
      <p>UPI ID: ${upiId}</p>
      <p>Requested Amount: ₹${amount}</p>
    `,
  };
  // Send email and respond to client
  try {
    await transporter.sendMail(mailOptions);
    const user = await User.findById(userId);
    if (user) {
      user.Wallet.TotalWallet -= amount;
      user.Wallet.WithdrawHistory.push({
        Time: moment().format("YYYY-MM-DD"),
        WithdrawAmount: amount,
        status: "pending"
      })
      await user.save();
      res.status(200).send(user);
    }
  } catch (error) {
    console.error('Error sending email:', error); // Log the error for debugging
    res.status(500).json({ error: 'Failed to process withdrawal request. Please try again.' });
  }
});
// increase user Daily Claim streak
router.post("/increaseClaimstreak", async (req, res) => {
  try {
    const { userId } = req.body;
    // Validate if userId is provided
    if (!userId) {
      return res.status(400).json({ error: "User ID is required." });
    }
    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }
    // Increment the DailyClaimStreak
    user.DailyCalimStreak = (user.DailyCalimStreak || 0) + 1;
    // Save the updated user
    await user.save();
    // Respond with the updated daily streak
    return res.status(200).json({ dailyStreak: user.DailyCalimStreak });
  } catch (error) {
    // Handle any errors
    console.error("Error updating DailyCalimStreak:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
});
// save the total spend time in user data
router.post("/saveSpendTime", async (req, res) => {
  const { userId, Time } = req.body;
  try {
    // Find the user by ID
    const user = await User.findById(userId);
    if (user) {
      // Increment the TotalStudyTime field by the provided Time
      user.TotalStudyTime += Time;
      // Save the updated user data
      await user.save();
      // Respond with success message
      res.status(200).json({data: user?.TotalStudyTime});
    } else {
      // If user not found, send an error response
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    // Catch any errors and send a failure response
    res.status(500).json({ message: 'Error updating study time', error: error.message });
  }
});

module.exports = router;










