import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePic: { type: String, default: "https://flaticon.com" },
    addresses: {
        home: { type: String, default: "" },
        work: { type: String, default: "" }
    },
    role: { type: String, default: "user" }
});

export default mongoose.model("User", userSchema);
