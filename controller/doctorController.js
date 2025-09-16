import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { Doctor } from "../models/doctorSchema.js";
import { sendEmail } from "../utils/email.js";

const JWT_SECRET = process.env.JWT_SECRET || "yoursecretkey";

export const signup = async (req, res) => {
  try {
    const { name, email, username, password } = req.body;

    const existingDoctor = await Doctor.findOne({
      $or: [{ email }, { username }],
    });
    if (existingDoctor)
      return res
        .status(400)
        .json({ message: "Email or username already exists." });

    const hashedPassword = await bcrypt.hash(password, 10);

    const doctor = await Doctor.create({
      name,
      email,
      username,
      password: hashedPassword,
    });

    res
      .status(201)
      .json({ message: "Signup successful", doctorId: doctor._id });
  } catch (err) {
    res.status(500).json({ message: "Signup failed", error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { emailOrUsername, password } = req.body;

    const doctor = await Doctor.findOne({
      $or: [{ email: emailOrUsername }, { username: emailOrUsername }],
    });

    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    const isMatch = await bcrypt.compare(password, doctor.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: doctor._id, role: "doctor" }, JWT_SECRET, {
      expiresIn: "1d",
    });

    doctor.sessionToken = token;
    await doctor.save();

    res.status(200).json({ message: "Login successful", token });
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err.message });
  }
};


export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const doctor = await Doctor.findOne({ email });
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    doctor.resetToken = resetToken;
    doctor.resetTokenExpiry = Date.now() + 1000 * 60 * 60; // 1 hour
    await doctor.save();

    // Compose email HTML with reset link, include token in URL
    const resetURL = `${process.env.FRONTEND_URL}/doctor/reset-password?token=${resetToken}`;
    const message = `
      <h1>Password Reset</h1>
      <p>Click the link below to reset your password:</p>
      <a href="${resetURL}">${resetURL}</a>
      <p>This link expires in 1 hour.</p>
    `;

   
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


export const resetPassword = async (req, res) => {
  try {
    const { resetToken, newPassword } = req.body;

    const doctor = await Doctor.findOne({
      resetToken,
      resetTokenExpiry: { $gt: Date.now() },
    });

    if (!doctor)
      return res
        .status(400)
        .json({ message: "Invalid or expired reset token" });

    doctor.password = await bcrypt.hash(newPassword, 10);
    doctor.resetToken = undefined;
    doctor.resetTokenExpiry = undefined;
    await doctor.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (err) {
    res.status(500).json({ message: "Reset failed", error: err.message });
  }
};

export const getDoctorProfile = async (req, res) => {
  try {
    const doctorId = req.doctor?.id || req.doctor?._id; // Comes from middleware
    if (!doctorId) return res.status(401).json({ message: "Unauthorized" });

    const doctor = await Doctor.findById(doctorId).select(
      "name email username"
    );

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    res.status(200).json(doctor);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to get doctor profile", error: err.message });
  }
};

