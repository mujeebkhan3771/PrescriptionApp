import express from "express";
import { getAllPatients, getNextPatientId, getPatientById, patientRegister } from "../controller/patientController.js";

const router = express.Router();

router.get("/next-id", getNextPatientId);
router.post("/register", patientRegister);
router.get("/", getAllPatients);
router.get("/:id", getPatientById);

export default router;
