const express = require("express");
const router = express.Router();
const User = require("../Models/User");
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
    if (user) {
        user.Wallet.TotalWallet += Price;
        await user.save()
        res.status(200).send(user);
    }
    else {
        res.send("user not found")
    }
})
module.exports = router;