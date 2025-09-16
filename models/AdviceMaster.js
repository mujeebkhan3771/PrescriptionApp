import mongoose from "mongoose";

const adviceSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
});

export const AdviceMaster = mongoose.model("AdviceMaster", adviceSchema);
