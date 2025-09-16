import mongoose from "mongoose";

const treatSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
});

export const TreatMaster = mongoose.model("TreatMaster", treatSchema);
