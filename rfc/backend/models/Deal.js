import mongoose from "mongoose";
const dealSchema = new mongoose.Schema({
    title: { type: String, required: true },
    price: { type: String, required: true },
    image: { type: String, required: true },
    description: { type: String }
});

export default mongoose.model("Deal", dealSchema);
