import express from "express";
import Rider from "../models/Rider.js"; 
import auth from "../middleware/auth.js";
import admin from "../middleware/admin.js";
const router = express.Router();
router.get("/", auth, admin, async (req, res) => {
    try {
        const riders = await Rider.find();
        res.json(riders);
    } catch (err) {
        res.status(500).json({ message: "Error fetching riders" });
    }
});
router.post("/", auth, admin, async (req, res) => {
    try {
        const rider = new Rider(req.body);
        await rider.save();
        res.json({ message: "Rider Added Successfully!" });
    } catch (err) {
        res.status(400).json({ message: "Error saving rider" });
    }
});

export default router;
