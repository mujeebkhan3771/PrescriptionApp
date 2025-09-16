import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { Superadmin } from "../models/Superadmin.js";
import { sendEmail } from "../utils/email.js";

const JWT_SECRET = process.env.JWT_SECRET || "yoursecretkey";

export const superadminLogin = async (req, res) => {
  try {
    const { username, password } = req.body;
    const admin = await Superadmin.findOne({ username });

    if (!admin)
      return res.status(404).json({ message: "Superadmin not found" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: admin._id, role: "superadmin" }, JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(200).json({ message: "Login successful", token });
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err.message });
  }
};

export const superadminForgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const admin = await Superadmin.findOne({ email });
    if (!admin)
      return res.status(404).json({ message: "Superadmin not found" });

    const resetToken = crypto.randomBytes(32).toString("hex");
    admin.resetToken = resetToken;
    admin.resetTokenExpiry = Date.now() + 1000 * 60 * 60; // 1 hour
    await admin.save();

    const resetURL = `${process.env.FRONTEND_URL}/superadmin/reset-password?token=${resetToken}`;
    const message = `
      <h1>Password Reset</h1>
      <p>Click the link below to reset your password:</p>
      <a href="${resetURL}">${resetURL}</a>
      <p>This link expires in 1 hour.</p>
    `;

    // Send reset email
    await sendEmail({
      to: email,
      subject: "Password Reset Request",
      html: message,
    });

    res.status(200).json({
      message: "Reset email sent",
    });
  } catch (err) {
    res.status(500).json({
      message: "Error generating reset token",
      error: err.message,
    });
  }
};

export const superadminResetPassword = async (req, res) => {
  try {
    const { resetToken, newPassword } = req.body;

    const admin = await Superadmin.findOne({
      resetToken,
      resetTokenExpiry: { $gt: Date.now() },
    });

    if (!admin)
      return res
        .status(400)
        .json({ message: "Invalid or expired reset token" });

    admin.password = await bcrypt.hash(newPassword, 10);
    admin.resetToken = undefined;
    admin.resetTokenExpiry = undefined;
    await admin.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (err) {
    res.status(500).json({ message: "Reset failed", error: err.message });
  }
};

export const verifySuperadmin = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader)
    return res.status(401).json({ message: "Authorization header missing" });

  const token = authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Token missing" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role !== "superadmin") {
      return res
        .status(403)
        .json({ message: "Access denied: Not a superadmin" });
    }
    req.superadminId = decoded.id;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token", error: err.message });
  }
};
