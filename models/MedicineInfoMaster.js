import mongoose from "mongoose";

const medicineInfoSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  dosage: { type: String, required: true },
  days: { type: String, required: true },
  remarks: { type: String, required: true },
});


export const MedicineInfoMaster = mongoose.model(
  "MedicineInfoMaster",
  medicineInfoSchema
);
