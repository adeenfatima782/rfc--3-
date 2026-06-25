import mongoose from "mongoose";

const riderSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true },
    status: { type: String, default: "Available" } 
});

const Rider = mongoose.model("Rider", riderSchema);
export default Rider;
