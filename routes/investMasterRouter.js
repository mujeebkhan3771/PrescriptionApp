import express from "express";
import {
  createBulkInvest,
  createInvest,
  getAllInvest,
} from "../controller/InvestMasterController.js";

const router = express.Router();

router.post("/", createInvest);
router.post("/bulk", createBulkInvest);
router.get("/", getAllInvest);

export default router;
