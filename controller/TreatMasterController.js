// TreatMasterController.js
import { TreatMaster } from "../models/TreatMaster.js";
import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import status from "http-status";
import errorHandler from "../utils/ErrorHandler.js";

// Create a new treatment
export const createTreat = catchAsyncErrors(async (req, res, next) => {
  const { name } = req.body;
  if (!name) return next(errorHandler("Name is required", 400));
  const treat = await TreatMaster.create({ name });
  res.status(status.CREATED).json({
    success: true,
    message: "Treatment created successfully",
    data: treat,
  });
});

export const createBulkTreat = catchAsyncErrors(async (req, res, next) => {
  const { names } = req.body;
  if (!Array.isArray(names) || names.length === 0)
    return next(errorHandler("Array of names is required", 400));

  const inserted = await TreatMaster.insertMany(
    names.map((name) => ({ name }))
  );
  res.status(status.CREATED).json({
    success: true,
    message: `${inserted.length} treatments created successfully`,
    data: inserted,
  });
});


// Get all treatments
export const getAllTreat = catchAsyncErrors(async (req, res, next) => {
  const treatList = await TreatMaster.find({});
  res.status(status.OK).json({
    success: true,
    message: "Fetched all treatments",
    data: treatList,
  });
});
