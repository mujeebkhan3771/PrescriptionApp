
import express from "express";
import { createBulkRefby, createRefby, getAllRefby } from "../controller/RefbyMasterController.js";

const router = express.Router();

router.post("/", createRefby);
router.get("/", getAllRefby);
router.post("/bulk", createBulkRefby);


export default router;
