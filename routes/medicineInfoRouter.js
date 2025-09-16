import express from "express";
import {
  getMedicineInfo,
  createOrUpdateMedicineInfo,
  getAllMedicineInfo,
  createBulkMedicines,
  searchMedicines, 
} from "../controller/MedicineInfoController.js";

const router = express.Router();

router.get("/medicines", searchMedicines);
router.get("/", getAllMedicineInfo); 
router.post("/", createOrUpdateMedicineInfo);
router.post("/bulk", createBulkMedicines);
router.get("/:medicineId", getMedicineInfo);


export default router;
