import status from "http-status";
import { Prescription } from "../models/prescripSchema.js";
import { Patient } from "../models/patientSchema.js";
import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import errorHandler from "../utils/ErrorHandler.js";
import { MedicineInfoMaster } from "../models/MedicineInfoMaster.js";
import { buildCustomizedMedicineEntries } from "./buildCustomMedicine.js";
import { getISTDateTime } from "../utils/getISTDateTime.js";


export const createPrescription = catchAsyncErrors(async (req, res, next) => {
  const {
    patient: patientId,
    refby,
    comp,
    exam,
    invest,
    diag,
    treat,
    plan,
    medicines,
    advice,
  } = req.body;

  if (!patientId) return next(errorHandler("Patient ID required", 400));

  const found = await Patient.findById(patientId);
  if (!found) return next(errorHandler("Patient not found", 404));

  // Build medicines entries with default or customized values
  const customized = await buildCustomizedMedicineEntries(medicines);

  const { date, time } = getISTDateTime();
  const prescriptions = await Prescription.create({
    patient: found._id,
    refby,
    comp,
    exam,
    invest,
    diag,
    treat,
    plan,
    medicines: customized,
    advice,
    prescripDate: date,
    prescripTime: time,
  });

  res.status(201).json({ success: true, data: prescriptions });
});



export const getPrescriptionsByPatient = async (req, res, next) => {
  try {
    const { patient } = req.params;

    const prescriptions = await Prescription.find({ patient })
      .populate("refby")
      .populate("comp")
      .populate("exam")
      .populate("invest")
      .populate("diag")
      .populate("treat")
      .populate("plan")
      .populate("advice")
      .populate("medicines.medicineId");

    res.status(200).json({ success: true, data: prescriptions });
  } catch (err) {
    console.error("Error in getPrescriptionsByPatient:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};




export const updatePrescription = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const { patient,refby, comp, exam, invest, diag, treat, plan, medicines, advice } =
    req.body;

  if (!patient) return next(errorHandler("Patient ID is required", 400));

  const prescription = await Prescription.findById(id);
  if (!prescription) return next(errorHandler("Prescription not found", 404));

  // Update fields
  prescription.patient = patient;
  prescription.refby = refby || [];
  prescription.comp = comp || [];
  prescription.exam = exam || [];
  prescription.invest = invest || [];
  prescription.diag = diag || [];
  prescription.treat = treat || [];
  prescription.plan = plan || [];
  prescription.advice = advice || [];

  // Update medicines
  const customizedMedicines = await buildCustomizedMedicineEntries(medicines);
 const existingMedicines = prescription.medicines || [];

 const mergedMedicinesMap = new Map();

 existingMedicines.forEach((m) => {
   mergedMedicinesMap.set(m.medicineId.toString(), m);
 });

 customizedMedicines.forEach((m) => {
   mergedMedicinesMap.set(m.medicineId.toString(), m);
 });

 prescription.medicines = Array.from(mergedMedicinesMap.values());


  // Add updated timestamp
  const { date, time } = getISTDateTime();
  const updateTimestamp = `${date} ${time}`;

  // Push update timestamp to updatedDates
  if (!prescription.updatedDates) {
    prescription.updatedDates = [];
  }
  prescription.updatedDates.push(updateTimestamp);

  // Do NOT reset prescripDate and prescripTime on update
  // They should reflect original creation time

  await prescription.save();

  res.status(status.OK).json({
    success: true,
    message: "Prescription updated successfully",
    data: prescription,
  });
});

export const deletePrescription = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  const prescription = await Prescription.findById(id);
  if (!prescription) {
    return next(errorHandler("Prescription not found", 404));
  }

  await Prescription.findByIdAndDelete(id);

  res.status(status.OK).json({
    success: true,
    message: "Prescription deleted successfully",
  });
});

export const getMedicineInfo = catchAsyncErrors(async (req, res, next) => {
  const { medicineId } = req.params;

  const data = await MedicineInfoMaster.findById(medicineId); // Use _id

  if (!data) {
    return next(errorHandler("No data found for selected medicine", 404));
  }

  res.status(200).json({
    success: true,
    data,
  });
});

