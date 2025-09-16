// controllers/patientController.js
import status from "http-status";
import { Patient } from "../models/patientSchema.js";
import { getISTDateTime } from "../utils/getISTDateTime.js";
import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import errorHandler from "../utils/ErrorHandler.js";

// Register a new patient
export const patientRegister = catchAsyncErrors(async (req, res, next) => {
  const {
    patId,
    patName,
    patAge,
    patGender,
    patAddress,
    patArea,
    patPlace,
    patPincode,
    patPhone,
    patEmail,
  } = req.body;

  if (
    !patId ||
    !patName ||
    !patAge ||
    !patGender ||
    !patAddress ||
    !patArea ||
    !patPlace ||
    !patPincode ||
    !patPhone ||
    !patEmail
  ) {
    return next(errorHandler("Please fill the full form!", 400));
  }

  // Check for duplicate patId
  const existingPatient = await Patient.findOne({ patId });
  if (existingPatient) {
    return next(errorHandler(`Patient UID ${patId} already exists`, 409));
  }

  const { date: istDate, time: istTime } = getISTDateTime();

  const patient = await Patient.create({
    patId,
    patName,
    patAge,
    patGender,
    patAddress,
    patArea,
    patPlace,
    patPincode,
    patPhone,
    patEmail,
    patDate: istDate,
    patTime: istTime,
  });

  res.status(status.CREATED).json({
    success: true,
    message: "Patient registered successfully",
    data: patient,
  });
});

// Get all patients
export const getAllPatients = catchAsyncErrors(async (req, res, next) => {
  const patients = await Patient.find({}).sort({ patId: -1 });

  res.status(status.OK).json({
    success: true,
    message: "Patients fetched successfully",
    data: patients,
  });
});

export const getPatientById = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  const patient = await Patient.findById(id);

  if (!patient) {
    return next(errorHandler("Patient not found", 404));
  }

  res.status(status.OK).json({
    success: true,
    message: "Patient fetched successfully",
    data: patient,
  });
});

export const getNextPatientId = catchAsyncErrors(async (req, res, next) => {
  try {
    const latestPatient = await Patient.findOne()
      .sort({ patId: -1 })
      .select("patId");
    const nextPatId = latestPatient?.patId ? latestPatient.patId + 1 : 1001;
    res.status(200).json({ success: true, nextPatId });
  } catch (error) {
    console.error("Error fetching next patient ID:", error); // <-- Log error here
    return next(errorHandler("Failed to fetch next Patient ID", 500));
  }
});
