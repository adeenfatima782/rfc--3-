import mongoose from "mongoose";

const locationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  address: String,
  lat: Number,
  lng: Number,
});

export default mongoose.model("Location", locationSchema);