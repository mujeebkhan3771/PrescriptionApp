import mongoose, { Schema } from "mongoose";
import validator from "validator";

const superadminSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, "Please provide a valid email"],
    },
    password: {
      type: String,
      required: true,
    },
    resetToken: String,
    resetTokenExpiry: Date,
  },
  { timestamps: true }
);

const Superadmin = mongoose.model("Superadmin", superadminSchema);
export { Superadmin };
