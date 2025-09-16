import mongoose from "mongoose";

const refbySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
});

export const RefbyMaster = mongoose.model("RefbyMaster", refbySchema);
