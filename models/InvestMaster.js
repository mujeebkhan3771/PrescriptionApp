import mongoose from "mongoose";

const investSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
});

export const InvestMaster = mongoose.model("InvestMaster", investSchema);
