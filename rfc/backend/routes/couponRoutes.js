import express from "express";
import Coupon from "../models/Coupon.js";
const router = express.Router();
router.post("/validate", async (req, res) => {
    const { code } = req.body;
    const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });
    if (coupon) {
        res.json({ discount: coupon.discount });
    } else {
        res.status(404).json({ message: "Invalid or Expired Coupon" });
    }
});

export default router;
