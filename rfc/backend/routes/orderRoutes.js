import express from "express";
import crypto from "crypto";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import Location from "../models/Location.js";
import auth from "../middleware/auth.js";
import admin from "../middleware/admin.js";
const router = express.Router();
router.post("/", auth, async (req, res) => {
  try {
    const { items, total, address, paymentMethod, location } = req.body;
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: "Cart is empty" });
    }
    for (const item of items) {
      const product = await Product.findById(item._id);
      if (!product) {
        return res.status(404).json({ success: false, message: `${item.name} not found` });
      }
      if (product.stock < (item.qty || 1)) {
        return res.status(400).json({ success: false, message: `${product.name} is out of stock` });
      }
      product.stock -= (item.qty || 1);
      await product.save();
    }
    const shortId = "RFC-" + crypto.randomBytes(3).toString("hex").toUpperCase();
    const newOrder = new Order({
      userId: req.userId,
      shortId,
      items,
      total,
      address: address || "No address provided",
      paymentMethod: paymentMethod || "COD",
      location: location || { lat: 31.5204, lng: 74.3587 },
      status: "Pending"
    });
    const savedOrder = await newOrder.save();
    res.status(201).json({
      success: true,
      message: "Order placed successfully!",
      shortId,
      order: savedOrder,
    });
  } catch (err) {
    console.error("ORDER ERROR:", err);
    res.status(500).json({ success: false, message: "Failed to place order", error: err.message });
  }
});
router.get("/track/:shortId", async (req, res) => {
  try {
    const order = await Order.findOne({
      shortId: req.params.shortId.toUpperCase(),
    }).select("shortId status total items location createdAt");
    
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }
    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error tracking order" });
  }
});

router.get("/my", auth, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error fetching orders" });
  }
});

router.get("/all", auth, admin, async (req, res) => {
  try {
    const allOrders = await Order.find()
      .populate("userId", "name email")
      .populate("riderId", "name phone status")
      .sort({ createdAt: -1 });
    res.json(allOrders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error fetching all orders" });
  }
});

router.put("/status/:id", auth, admin, async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    if (!updatedOrder) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }
    res.json({ success: true, message: "Status updated", order: updatedOrder });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to update status" });
  }
});

router.put("/assign-rider/:id", auth, admin, async (req, res) => {
  try {
    const { riderId } = req.body;
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { riderId },
      { new: true }
    ).populate("riderId", "name phone status");
    
    if (!updatedOrder) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }
    res.json({ success: true, message: "Rider assigned successfully", order: updatedOrder });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to assign rider" });
  }
});

router.put("/cancel/:id", auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });
    if (order.status !== "Pending") {
      return res.status(400).json({ success: false, message: "Cannot cancel now" });
    }
    
    // Rollback dynamic item stock metrics safely
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item._id, { $inc: { stock: item.qty || 1 } });
    }
    order.status = "Cancelled";
    await order.save();
    res.json({ success: true, message: "Order cancelled" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Cancellation failed" });
  }
});

export default router;
