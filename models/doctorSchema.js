import mongoose, { Schema } from "mongoose";
import validator from "validator";

const doctorSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, "Please provide a valid email"],
    },
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    resetToken: String,
    resetTokenExpiry: Date,
    sessionToken: String,
  },
  { timestamps: true }
);

const Doctor = mongoose.model("Doctor", doctorSchema);
export { Doctor };
