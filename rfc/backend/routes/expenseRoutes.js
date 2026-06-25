import express from "express";
import Expense from "../models/Expense.js";
import auth from "../middleware/auth.js";
import admin from "../middleware/admin.js";
const router = express.Router();
router.post("/", auth, admin, async (req, res) => {
    try {
        const { category, amount, description } = req.body;
        const newExpense = new Expense({
            category,
            amount: Number(amount),
            description,
            date: new Date()});
        await newExpense.save();
        res.status(201).json({ success: true, message: "Expense Recorded Successfully!" });
    } catch (err) {
        res.status(500).json({ success: false, message: "Server Error: " + err.message });}});
router.get("/", auth, admin, async (req, res) => {
    try {
        const expenses = await Expense.find().sort({ date: -1 });
        res.json(expenses);
    } catch (err) {
        res.status(500).json({ success: false, message: "Fetch failed" });}});
export default router;
