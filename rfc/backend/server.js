import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import http from "http";
import { Server } from "socket.io";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import locationRoutes from "./routes/locationRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import dealRoutes from "./routes/dealRoutes.js";
import "./models/Rider.js";
import "./models/Subscriber.js";
import "./models/Expense.js";
dotenv.config();
if (!process.env.JWT_SECRET) {
  console.error("CRITICAL ERROR: JWT_SECRET is not defined.");
  process.exit(1);
}
const app = express();
const server = http.createServer(app); 
const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
const io = new Server(server, { cors: corsOptions });
app.use(morgan("dev"));
app.use(helmet({ crossOriginResourcePolicy: false, contentSecurityPolicy: false }));
app.use(cors(corsOptions));
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 1000, 
  message: { success: false, message: "Too many requests, please try again later." },
});
app.use("/api", limiter);
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use((req, res, next) => {
  req.io = io;
  next();
});
app.use("/api/auth", authRoutes); 
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/location", locationRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/deals", dealRoutes);
app.get("/", (req, res) => {
  res.status(200).json({ success: true, message: "RFC Production Server with Live WebSockets running 🚀" });
});
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route Not Found" });
});
app.use((err, req, res, next) => {
  console.error("❌ BACKEND CRASH DETAILS:", err.message);
  res.status(500).json({ success: false, message: "Internal Server Error" });
});
io.on("connection", (socket) => {
  console.log(`🔌 Live Stream Connected Node: ${socket.id}`);
  socket.on("join_room", (roomId) => {
    socket.join(roomId);
    console.log(`👤 User Socket ${socket.id} locked in Room: ${roomId}`);
  });
  socket.on("send_message", (data) => {
    io.to(data.room).emit("receive_message", data);
  });
  socket.on("update_rider_geo", (data) => {
    io.to(data.orderId).emit("rider_geo_pushed", { lat: data.lat, lng: data.lng });
  });
  socket.on("disconnect", () => {
    console.log(`🔌 Connection Dropped: ${socket.id}`);
  });
});
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected Successfully ✅");
    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.log("MongoDB Connection Error ❌", err);
  });
