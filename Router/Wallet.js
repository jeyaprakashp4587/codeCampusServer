const express = require("express");
const router = express.Router();
const User = require("../Models/User");
const nodemailer = require("nodemailer");
const moment = require("moment");

// Utility function for finding a user
async function findUserById(userId, res) {
  try {
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return null;
    }
    return user;
  } catch (error) {
    console.error("Error finding user:", error);
    res.status(500).json({ error: "Internal server error" });
    return null;
  }
}

// Change GPay details
router.post("/ChangeGpayDetails/:id", async (req, res) => {
  const { id } = req.params;
  const { GpayAccountName, GpayUpiId } = req.body;

  if (!GpayAccountName || !GpayUpiId) {
    return res
      .status(400)
      .json({ error: "Both GPay account name and UPI ID are required" });
  }

  const user = await findUserById(id, res);
  if (!user) return;

  user.Wallet.GpayAccount = { GpayAccountName, GpayUpiId };
  user.Wallet.TotalWallet = user.Wallet.TotalWallet || 0;

  try {
    await user.save();
    res.status(200).json(user);
  } catch (error) {
    console.error("Error saving GPay details:", error);
    res.status(500).json({ error: "Error saving GPay details" });
  }
});

// Add to Wallet
router.post("/AddWallet/:id", async (req, res) => {
  const { id } = req.params;
  const { Price } = req.body;

  if (!Price || isNaN(Price) || Price <= 0) {
    return res.status(400).json({ error: "Invalid or missing Price" });
  }

  const user = await findUserById(id, res);
  if (!user) return;

  user.Wallet.TotalWallet += Price;

  try {
    await user.save();
    res.status(200).json({ Wallet: user.Wallet });
  } catch (error) {
    console.error("Error adding to wallet:", error);
    res.status(500).json({ error: "Error adding to wallet" });
  }
});

// Withdrawal
router.post("/withdrawal", async (req, res) => {
  const { userId, userName, accountName, upiId, amount } = req.body;

  if (
    !userId ||
    !userName ||
    !accountName ||
    !upiId ||
    !amount ||
    amount <= 0
  ) {
    return res
      .status(400)
      .json({ error: "All fields are required with a valid amount" });
  }

  const user = await findUserById(userId, res);
  if (!user) return;

  if (user.Wallet.TotalWallet < amount) {
    return res.status(400).json({ error: "Insufficient wallet balance" });
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "jeyaprakashp431@gmail.com",
      pass: "qiri pwwh hcyn nrek", // Use App Password here
    },
  });

  const mailOptions = {
    from: "jeyaprakashp431@gmail.com",
    to: "pjeya8080@gmail.com",
    subject: "New Withdrawal Request",
    html: `
      <p>User ID: ${userId}</p>
      <p>User Name: ${userName}</p>
      <p>Account Name: ${accountName}</p>
      <p>UPI ID: ${upiId}</p>
      <p>Requested Amount: ₹${amount}</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);

    user.Wallet.TotalWallet -= amount;
    user.Wallet.WithdrawHistory.push({
      Time: moment().format("YYYY-MM-DD"),
      WithdrawAmount: amount,
      status: "pending",
    });

    await user.save();
    res.status(200).json(user);
  } catch (error) {
    console.error("Error processing withdrawal:", error);
    res.status(500).json({ error: "Failed to process withdrawal request" });
  }
});

// Increase Daily Claim Streak
router.post("/increaseClaimstreak", async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  const user = await findUserById(userId, res);
  if (!user) return;

  user.DailyCalimStreak = (user.DailyCalimStreak || 0) + 1;

  try {
    await user.save();
    res.status(200).json({ dailyStreak: user.DailyCalimStreak });
  } catch (error) {
    console.error("Error updating DailyCalimStreak:", error);
    res.status(500).json({ error: "Error updating streak" });
  }
});

// Save Study Time
router.post("/saveSpendTime", async (req, res) => {
  const { userId, Time } = req.body;

  if (!userId || !Time || Time <= 0) {
    return res
      .status(400)
      .json({ error: "Valid userId and Time are required" });
  }

  const user = await findUserById(userId, res);
  if (!user) return;

  user.TotalStudyTime = (user.TotalStudyTime || 0) + Time;

  try {
    await user.save();
    res.status(200).json({ data: user.TotalStudyTime });
  } catch (error) {
    console.error("Error saving study time:", error);
    res.status(500).json({ error: "Error updating study time" });
  }
});

module.exports = router;
