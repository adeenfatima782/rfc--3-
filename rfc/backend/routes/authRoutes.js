import express from "express";
import User from "../models/User.js";
import Subscriber from "../models/Subscriber.js"; 
import Coupon from "../models/Coupon.js";
import Expense from "../models/Expense.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import auth from "../middleware/auth.js"; 
import admin from "../middleware/admin.js";
const router = express.Router();
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) return res.status(400).json({ message: "User already exists" });
    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ 
      name, 
      email: email.toLowerCase(), 
      password: hashed});
    await user.save();
    res.status(201).json({ success: true, message: "User Registered Successfully! Welcome to RFC. 🎉" });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });}});
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(400).json({ message: "User not found" });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid password" });
    
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "SECRET_KEY", { expiresIn: "1d" });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: "Server error during login" });
  }
});
router.get("/me", auth, async (req, res) => {
    try {
        const user = await User.findById(req.userId).select("-password").lean();
        if (!user) return res.status(404).json({ message: "User not found" });
        user.id = user._id.toString(); 
        const isSubscriber = await Subscriber.findOne({ email: user.email.toLowerCase() });
        res.json({ ...user, isSubscriber: !!isSubscriber });
    } catch (err) {
        res.status(500).json({ message: "Error fetching user status" });
    }});
router.put("/update-profile", auth, async (req, res) => {
    try {
        const { name, profilePic, addresses } = req.body;
        const updatedUser = await User.findByIdAndUpdate(
            req.userId,
            { $set: { name, profilePic, addresses } },
            { returnDocument: 'after' }
        ).select("-password");
        res.json(updatedUser);
    } catch (err) {
        res.status(500).json({ message: "Update failed" });
    }
});
router.post("/subscribe", async (req, res) => {
    try {
        const { email, userId } = req.body;
        if (!email) return res.status(400).json({ message: "Email is required!" });
        const existing = await Subscriber.findOne({ email: email.toLowerCase() });
        if (existing) return res.status(400).json({ message: "You are already subscribed! 🎉" });
        const newSubscriber = new Subscriber({ email: email.toLowerCase(), userId: userId || null });
        await newSubscriber.save();
        res.status(201).json({ message: "Subscribed Successfully! Welcome to RFC Club 🍔" });
    } catch (err) {
        res.status(500).json({ message: "Subscription failed: " + err.message });
    }
});
router.get("/subscribers", auth, admin, async (req, res) => {
    try {
        const list = await Subscriber.find().sort({ subscribedAt: -1 });
        res.json(list);
    } catch (err) {
        res.status(500).json({ message: "Failed to load subscribers" });
    }
});
router.post("/coupons", auth, admin, async (req, res) => {
    try {
        const { code, discount } = req.body;
        if (!code || !discount) return res.status(400).json({ message: "Fields required" });
        const existing = await Coupon.findOne({ code: code.toUpperCase() });
        if (existing) return res.status(400).json({ message: "Coupon already exists!" });
        const newCoupon = new Coupon({ code: code.toUpperCase(), discount: Number(discount), isActive: true });
        await newCoupon.save();
        res.status(201).json({ message: `Promo code ${code.toUpperCase()} activated! 🏷️` }); 
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
router.get("/active-coupons", async (req, res) => {
    try {
        const coupons = await Coupon.find({ isActive: true }).sort({ _id: -1 });
        res.json(coupons);  
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
router.get("/cart-coupons", auth, async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) return res.status(404).json({ message: "User not found" });
        const isSubscriber = await Subscriber.findOne({
            $or: [{ userId: user._id }, { email: user.email.toLowerCase() }]
        });
        if (isSubscriber) {
            const activeCoupons = await Coupon.find({ isActive: true }).sort({ discount: -1 }).limit(5);
            return res.json({ isSubscriber: true, coupons: activeCoupons });
        } else {
            return res.json({ isSubscriber: false, coupons: [] });
        } 
    } catch (err) {
        res.status(500).json({ message: "Processing failed: " + err.message }); 
    }
});
router.post("/coupons/validate", auth, async (req, res) => {
    try {
        const { code } = req.body;
        const user = await User.findById(req.userId);
        if (!user) return res.status(404).json({ message: "User not found" });
        const isSubscriber = await Subscriber.findOne({
            $or: [{ userId: user._id }, { email: user.email.toLowerCase() }]
        });
        if (!isSubscriber) {
            return res.status(403).json({ message: "This coupon is exclusively for RFC Club Subscribers! Please subscribe at the footer first. 🍔" });
        }
        const coupon = await Coupon.findOne({ code: code.trim().toUpperCase(), isActive: true });
        if (!coupon) return res.status(404).json({ message: "Invalid or Expired Promo Code!" });        
        res.json({ discount: coupon.discount }); 
    } catch (err) {
        res.status(500).json({ message: "Server validation error: " + err.message });
    }
});

// ✅ RECORD OPERATIONAL RESOURCE COSTS EXTENSIONS (Admin Only)
router.post("/expenses", auth, admin, async (req, res) => {
    try {
        const { category, amount, description } = req.body;
        const newExpense = new Expense({ category, amount: Number(amount), description, date: new Date() });
        await newExpense.save();
        res.status(201).json({ success: true, message: "Expense Recorded Successfully! 💰" });
    } catch (err) {
        res.status(500).json({ success: false, message: "Server Error: " + err.message });
    }
});

// ✅ REVENUE FINANCIAL BUSINESS ANALYSIS REPORTS LEDGER (Admin Only)
router.get("/expenses", auth, admin, async (req, res) => {
    try {
        const expenses = await Expense.find().sort({ date: -1 });
        res.json(expenses); 
    } catch (err) {
        res.status(500).json({ success: false, message: "Ledger Error: " + err.message });
    }
});

export default router;
