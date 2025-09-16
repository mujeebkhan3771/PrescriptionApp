import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import mongoose from "mongoose";

import doctorRouter from "./routes/doctorRouter.js";
import superadminRouter from "./routes/superadminRouter.js";

import cors from "cors";
import patientRouter from "./routes/patientRouter.js";
import prescripRouter from "./routes/prescripRouter.js";
import adviceMasterRouter from "./routes/adviceMasterRouter.js";
import compMasterRouter from "./routes/compMasterRouter.js";
import refbyMasterRouter from "./routes/refbyMasterRouter.js";
import diagMasterRouter from "./routes/diagMasterRouter.js";

import examMasterRouter from "./routes/examMasterRouter.js";
import investMasterRouter from "./routes/investMasterRouter.js";
import medicineInfoRouter from "./routes/medicineInfoRouter.js";

import planMasterRouter from "./routes/planMasterRouter.js";

import treatMasterRouter from "./routes/treatMasterRouter.js";

import errorMiddleware from "./middlewares/errorMiddleware.js";
import errorHandler from "./utils/ErrorHandler.js";

const app = express();
app.set("PORT", process.env.PORT || 8000);

app.get("/home", (req, res) => {
  return res.json({ hello: "World" });
});

const JWT_SECRET =
  process.env.JWT_SECRET || "ThisIsASecretKeyForJWTTokenGeneration";
// app.use(
//   cors({
//     origin: "http://localhost:5173",
//     methods: ["POST", "GET", "PUT", "DELETE"],
//   })
// );
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/patients", patientRouter);
app.use("/api/prescriptions", prescripRouter);
app.use("/api/refbymasters", refbyMasterRouter);
app.use("/api/advicemasters", adviceMasterRouter);
app.use("/api/compmasters", compMasterRouter);
app.use("/api/diagmasters", diagMasterRouter);

app.use("/api/exammasters", examMasterRouter);
app.use("/api/investmasters", investMasterRouter);

app.use("/api/planmasters", planMasterRouter);

app.use("/api/treatmasters", treatMasterRouter);
app.use("/api/medicineinfo", medicineInfoRouter);
app.use("/api/doctors", doctorRouter);
app.use("/api/superadmin", superadminRouter);

app.use(errorMiddleware);
app.use(errorHandler);

const start = async () => {
  try {
    const connectionDB = await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to DB");
    console.log(`MONGO Connected DB Host: ${connectionDB.connection.host}`);

    app.listen(app.get("PORT"), () => {
      console.log(` Listening on PORT ${app.get("PORT")}`);
    });
  } catch (err) {
    console.error("DB connection error:", err);
  }
};

start();



// console.log("✅ Environment variables loaded:");
// console.log("EMAIL_USER:", process.env.EMAIL_USER);
// console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "****" : undefined);

export default app;
