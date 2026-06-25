import express from "express";
import Location from "../models/Location.js";
import auth from "../middleware/auth.js";
const router = express.Router();
router.post("/", auth, async (req, res) => {
  const location = new Location({
    ...req.body,
    userId: req.userId,
  });
  await location.save();

  res.json({ message: "Location saved" });
});

router.get("/my", auth, async (req, res) => {
  const loc = await Location.findOne({ userId: req.userId });
  res.json(loc);
});

export default router;