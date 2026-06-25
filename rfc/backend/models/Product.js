import mongoose from "mongoose";
const reviewSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
}, { timestamps: true }); 
const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String },
    isBestSeller: { type: Boolean, default: false },
    isTopDeal: { type: Boolean, default: false },
    stock: { type: Number, default: 0 },
    tags: { type: [String], default: [] },
    reviews: [reviewSchema],
    numReviews: { type: Number, default: 0 },
    rating: { type: Number, default: 0 }
}, { 
    timestamps: true 
});

const Product = mongoose.model("Product", productSchema);
export default Product;
