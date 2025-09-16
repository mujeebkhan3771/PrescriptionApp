import mongoose from "mongoose";

const compSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
});

export const CompMaster = mongoose.model("CompMaster", compSchema);
