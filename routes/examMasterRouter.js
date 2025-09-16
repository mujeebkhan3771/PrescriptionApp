import express from "express";
import { createBulkExam, createExam, getAllExam } from "../controller/ExamMasterController.js";

const router = express.Router();

router.post("/", createExam);
router.post("/bulk", createBulkExam);
router.get("/", getAllExam);

export default router;
