import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    shortId: { type: String, unique: true }, 
    items: Array,
    total: Number,
    address: String,      
    paymentMethod: { type: String, default: "COD" }, 
    location: {
        lat: { type: Number, default: 31.5204 },
        lng: { type: Number, default: 74.3587 }
    },
    riderId: { type: mongoose.Schema.Types.ObjectId, ref: "Rider", default: null },
    status: { type: String, default: "Pending" },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Order", orderSchema);
