import mongoose from "mongoose";
const couponSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true },
    discount: { type: Number, required: true }, // e.g., 20 for 20%
    isActive: { type: Boolean, default: true }
});
export default mongoose.model("Coupon", couponSchema);
