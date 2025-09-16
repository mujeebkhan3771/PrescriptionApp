// middlewares/authMiddleware.js
import jwt from "jsonwebtoken";
import { Doctor } from "../models/doctorSchema.js";
import { Superadmin } from "../models/superadmin.js";

const JWT_SECRET = process.env.JWT_SECRET || "yoursecretkey";

export const protectRole = (role) => {
  return async (req, res, next) => {
    let token;

    // 1. Get token from Authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET);

      // 2. Role check
      if (decoded.role !== role) {
        return res
          .status(403)
          .json({ message: `Access denied: Not a ${role}` });
      }

      // 3. Attach user based on role
      if (role === "doctor") {
        const doctor = await Doctor.findById(decoded.id).select(
          "-password -resetToken -resetTokenExpiry -sessionToken"
        );
        if (!doctor) {
          return res.status(404).json({ message: "Doctor not found" });
        }
        req.doctor = doctor;
      } else if (role === "superadmin") {
        const superadmin = await Superadmin.findById(decoded.id).select(
          "-password"
        );
        if (!superadmin) {
          return res.status(404).json({ message: "Superadmin not found" });
        }
        req.superadmin = superadmin;
      }

      next();
    } catch (err) {
      console.error("Token error:", err);
      res.status(401).json({ message: "Invalid token", error: err.message });
    }
  };
};
