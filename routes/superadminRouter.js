import express from "express";
import {
  superadminLogin,
  superadminForgotPassword,
  superadminResetPassword,
} from "../controller/superadminController.js";
import { signup } from "../controller/doctorController.js";
import { protectRole } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Superadmin login (public)
router.post("/login", superadminLogin);

// Forgot/reset password for superadmin (public)
router.post("/forgot-password", superadminForgotPassword);
router.post("/reset-password", superadminResetPassword);

// Protected: Only superadmin can add doctor
router.post("/signup-doctor", protectRole("superadmin"), signup);

// Get current superadmin profile
router.get("/me", protectRole("superadmin"), (req, res) => {
  res.json({
    id: req.superadmin._id,
    username: req.superadmin.username,
    email: req.superadmin.email,
  });
});

export default router;
