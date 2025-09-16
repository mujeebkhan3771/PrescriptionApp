// DiagMasterController.js
import { DiagMaster } from "../models/DiagMaster.js";
import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import status from "http-status";
import errorHandler from "../utils/ErrorHandler.js";

// Create a new diagnosis
export const createDiag = catchAsyncErrors(async (req, res, next) => {
  const { name } = req.body;
  if (!name) return next(errorHandler("Name is required", 400));
  const diag = await DiagMaster.create({ name });
  res.status(status.CREATED).json({
    success: true,
    message: "Diagnosis created successfully",
    data: diag,
  });
});

export const createBulkDiag = catchAsyncErrors(async (req, res, next) => {
  const { names } = req.body;
  if (!Array.isArray(names) || names.length === 0)
    return next(errorHandler("Array of names is required", 400));

  const inserted = await DiagMaster.insertMany(names.map((name) => ({ name })));
  res.status(status.CREATED).json({
    success: true,
    message: `${inserted.length} diagnoses created successfully`,
    data: inserted,
  });
});



// Get all diagnoses
export const getAllDiag = catchAsyncErrors(async (req, res, next) => {
  const diagList = await DiagMaster.find({});
  res.status(status.OK).json({
    success: true,
    message: "Fetched all diagnoses",
    data: diagList,
  });
});
