import express from "express";
import { createBulkPlan, createPlan, getAllPlan } from "../controller/PlanMasterController.js";

const router = express.Router();

router.post("/", createPlan);
router.post("/bulk", createBulkPlan);
router.get("/", getAllPlan);

export default router;
