import mongoose from "mongoose";

const diagSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
});

export const DiagMaster = mongoose.model("DiagMaster", diagSchema);
