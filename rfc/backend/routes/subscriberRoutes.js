import express from "express";
import Subscriber from "../models/Subscriber.js";
const router = express.Router();
router.post("/subscribe", async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ message: "Email is required!" });
        const existing = await Subscriber.findOne({ email });
        if (existing) return res.status(400).json({ message: "You are already subscribed! 🎉" });
        const newSubscriber = new Subscriber({ email });
        await newSubscriber.save();
        res.status(201).json({ message: "Subscribed Successfully! Welcome to RFC Club 🍔" });
    } catch (err) {
        res.status(500).json({ message: "Subscription failed: " + err.message });}});
export default router;
