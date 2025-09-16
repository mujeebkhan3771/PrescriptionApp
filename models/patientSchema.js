import mongoose from "mongoose";

// Helper function to get current IST date and time
const getISTDateTime = () => {
  const now = new Date();
  const istDate = now.toLocaleDateString("en-GB", { timeZone: "Asia/Kolkata" }); // format: dd/mm/yyyy
  const istTime = now.toLocaleTimeString("en-IN", {
    timeZone: "Asia/Kolkata",
    hour12: true,
  }); // format: hh:mm:ss AM/PM
  return { date: istDate, time: istTime };
};

const patientSchema = new mongoose.Schema({
  patId: { type: Number, required: true , unique : true },
  patName: { type: String, required: true },
  patAge: { type: Number, required: true },
  patGender: { type: String, required: true, enum: ["Male", "Female"] },
  patAddress: { type: String, required: true },
  patArea: { type: String, required: true },
  patPlace: { type: String, required: true },
  patPincode: { type: Number, required: true },
  patPhone: { type: Number, required: true },
  patEmail: { type: String, required: true },
  patDate: {
    type: String,
    default: () => getISTDateTime().date,
  },
  patTime: {
    type: String,
    default: () => getISTDateTime().time,
  },
});

export const Patient = mongoose.model("Patient", patientSchema);
