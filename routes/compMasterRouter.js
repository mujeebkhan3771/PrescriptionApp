
import express from "express";
import { createBulkComp, createComp, getAllComp } from "../controller/CompMasterController.js";

const router = express.Router();

router.post("/", createComp);
router.get("/", getAllComp);
router.post("/bulk", createBulkComp);


export default router;
