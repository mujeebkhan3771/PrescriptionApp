import express from "express";
import { createBulkDiag, createDiag, getAllDiag } from "../controller/DiagMasterController.js";

const router = express.Router();

router.post("/", createDiag);
router.post("/bulk", createBulkDiag);
router.get("/", getAllDiag);


export default router;
