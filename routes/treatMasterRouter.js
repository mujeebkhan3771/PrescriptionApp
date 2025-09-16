import express from "express";
import {
  createBulkTreat,
  createTreat,
  getAllTreat,
} from "../controller/TreatMasterController.js";

const router = express.Router();

router.post("/", createTreat);
router.post("/bulk", createBulkTreat);
router.get("/", getAllTreat);

export default router;
