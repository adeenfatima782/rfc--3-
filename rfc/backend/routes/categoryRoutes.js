import express from "express";
import Category from "../models/Category.js";
import auth from "../middleware/auth.js";
import admin from "../middleware/admin.js";
const router = express.Router();
router.get("/", async (req, res) => {
    const categories = await Category.find();
    res.json(categories);
});
router.post("/", auth, admin, async (req, res) => {
    const category = new Category(req.body);
    await category.save();
    res.json({ message: "Category Added!" });
});
router.delete("/:id", auth, admin, async (req, res) => {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ message: "Category Deleted!" });
});

export default router;
