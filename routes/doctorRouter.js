import express from "express";
import {
  login,
  forgotPassword,
  resetPassword,
  signup,
  getDoctorProfile
} from "../controller/doctorController.js";
import { protectRole } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Doctor login
router.post("/login", login);

// Doctor forgot password
router.post("/forgot-password", forgotPassword);

// Doctor reset password
router.post("/reset-password", resetPassword);

// Protected by superadmin (for adding doctors)
router.post("/signup", protectRole("superadmin"), signup);


router.get("/me", protectRole("doctor"), getDoctorProfile);


export default router;
