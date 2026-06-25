import mongoose from "mongoose";
const expenseSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  category: { type: String, required: true }, 
  amount: { type: Number, required: true },
  description: String,
});

export default mongoose.model("Expense", expenseSchema);
