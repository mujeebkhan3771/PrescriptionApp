import mongoose from "mongoose";

const examSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
});

export const ExamMaster = mongoose.model("ExamMaster", examSchema);
