import mongoose from "mongoose";

const getISTDateTime = () => {
  const now = new Date();
  const istDate = now.toLocaleDateString("en-GB", { timeZone: "Asia/Kolkata" }); // dd/mm/yyyy
  const istTime = now.toLocaleTimeString("en-IN", {
    timeZone: "Asia/Kolkata",
    hour12: true,
  }); // hh:mm:ss AM/PM
  return { date: istDate, time: istTime };
};

const medicineEntrySchema = new mongoose.Schema(
  {
    medicineId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MedicineInfoMaster",
      required: true,
    },
    
    name: { type: String },
    dosage: { type: String },
    days: { type: String },
    remarks: { type: String },
  },
  { _id: false }
);

const prescripSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patient",
    required: true,
  },
  refby: [
    { type: mongoose.Schema.Types.ObjectId, ref: "RefbyMaster", required: true },
  ],
  comp: [
    { type: mongoose.Schema.Types.ObjectId, ref: "CompMaster", required: true },
  ],
  exam: [
    { type: mongoose.Schema.Types.ObjectId, ref: "ExamMaster", required: true },
  ],
  invest: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "InvestMaster",
      required: true,
    },
  ],
  diag: [
    { type: mongoose.Schema.Types.ObjectId, ref: "DiagMaster", required: true },
  ],
  treat: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TreatMaster",
      required: true,
    },
  ],
  plan: [
    { type: mongoose.Schema.Types.ObjectId, ref: "PlanMaster", required: true },
  ],
  medicines: [medicineEntrySchema],
  advice: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AdviceMaster",
      required: true,
    },
  ],
  prescripDate: {
    type: String,
    default: () => getISTDateTime().date,
  },
  prescripTime: {
    type: String,
    default: () => getISTDateTime().time,
  },
  updatedDates: [
    {
      type: String,
      default: () => getISTDateTime().date + " " + getISTDateTime().time,
    },
  ],
});

export const Prescription = mongoose.model("Prescrip", prescripSchema);
