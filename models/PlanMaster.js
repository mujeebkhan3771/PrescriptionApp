import mongoose from "mongoose";

const planSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
});

export const PlanMaster = mongoose.model("PlanMaster", planSchema);
