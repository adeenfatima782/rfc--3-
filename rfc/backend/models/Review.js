import mongoose from "mongoose";
const reviewSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    userName: String,
    rating: Number,
    comment: String
}, { timestamps: true });
export default mongoose.model("Review", reviewSchema);
