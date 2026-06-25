import mongoose from "mongoose";

const subscriberSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // 👈 Ab hum ID se track karenge
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    subscribedAt: { type: Date, default: Date.now }
});

export default mongoose.model("Subscriber", subscriberSchema);
