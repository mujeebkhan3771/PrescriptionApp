import express from "express";
import {
  createAdvice,
  createBulkAdvice,
  getAllAdvice,
} from "../controller/AdviceMasterController.js";

const router = express.Router();

router.post("/", createAdvice);
router.post("/bulk", createBulkAdvice); 
router.get("/", getAllAdvice);

export default router;
