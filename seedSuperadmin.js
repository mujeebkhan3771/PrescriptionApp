import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import { Superadmin } from "./models/Superadmin.js"; // Make sure path is correct

dotenv.config();

async function createSuperadmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const existingAdmin = await Superadmin.findOne({
      username: process.env.SUPERADMIN_USERNAME,
    });
    if (existingAdmin) {
      console.log("✅ Superadmin already exists. No action taken.");
      return process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(
      process.env.SUPERADMIN_PASSWORD,
      10
    );

    const superadmin = new Superadmin({
      username: process.env.SUPERADMIN_USERNAME,
      email: process.env.SUPERADMIN_EMAIL,
      password: hashedPassword,
    });

    await superadmin.save();
    console.log("Superadmin created successfully.");
    process.exit(0);
  } catch (error) {
    console.error(" Error creating Superadmin:", error);
    process.exit(1);
  }
}

createSuperadmin();
