import jwt from "jsonwebtoken";
import User from "../models/User.js";
const auth = async (req, res, next) => {
  let authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "No token authorization header provided" });
  }
  if (!authHeader.startsWith("Bearer ")) {
    authHeader = `Bearer ${authHeader}`;
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "SECRET_KEY");
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ message: "User not found in system loop" });
  req.user = user; 
    req.userId = decoded.id;
    next();
  } catch (err) {
    console.error("JWT Error:", err.message);
    res.status(401).json({ message: "Invalid or expired session token" });
  }
};

export default auth;
