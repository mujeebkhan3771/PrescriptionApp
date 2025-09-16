import express from "express";
import {
  createPrescription,
  deletePrescription,
  getPrescriptionsByPatient,
  updatePrescription,
  getMedicineInfo,
} from "../controller/prescripController.js";

const router = express.Router();

// Create a prescription
// router.post("/prescriptions", createPrescription);
router.post("/", createPrescription);

// router.get("/search", searchMedicines);
// Get all prescriptions for a patient
router.get("/byPatient/:patient", getPrescriptionsByPatient);

// Get medicine info by ID (renamed route for clarity)
router.get("/medicineinfo/:medicineId", getMedicineInfo);

// Update prescription by ID
router.put("/:id", updatePrescription);

// Delete prescription by ID
router.delete("/:id", deletePrescription);

export default router;
