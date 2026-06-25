import express from "express";
import Deal from "../models/Deal.js";
import auth from "../middleware/auth.js";
import admin from "../middleware/admin.js";
const router = express.Router();
router.get("/", async (req, res) => {
    const deals = await Deal.find();
    res.json(deals);});
router.post("/", auth, admin, async (req, res) => {
    const deal = new Deal(req.body);
    await deal.save();
    res.json({ message: "Deal Added Successfully!" });});
router.delete("/:id", auth, admin, async (req, res) => {
    await Deal.findByIdAndDelete(req.params.id);
    res.json({ message: "Deal Deleted!" });});
export default router;
