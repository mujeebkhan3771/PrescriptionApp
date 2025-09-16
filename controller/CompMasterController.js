// controller/compMasterController.js
import { CompMaster } from "../models/CompMaster.js";
import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import status from "http-status";
import errorHandler from "../utils/ErrorHandler.js";

// Create a new complaint
export const createComp = catchAsyncErrors(async (req, res, next) => {
  const { name } = req.body;

  if (!name) return next(errorHandler("Name is required", 400));

  const comp = await CompMaster.create({ name });

  res.status(status.CREATED).json({
    success: true,
    message: "Complaint created successfully",
    data: comp,
  });
});

// Bulk create complaints
export const createBulkComp = catchAsyncErrors(async (req, res, next) => {
  const { names } = req.body;

  if (!Array.isArray(names) || names.length === 0) {
    return next(errorHandler("Array of names is required", 400));
  }

  const bulkComp = names.map((name) => ({ name }));
  const inserted = await CompMaster.insertMany(bulkComp);

  res.status(status.CREATED).json({
    success: true,
    message: `${inserted.length} complaints created successfully`,
    data: inserted,
  });
});


// Get all complaints
export const getAllComp = catchAsyncErrors(async (req, res, next) => {
  const compList = await CompMaster.find({});
  res.status(status.OK).json({
    success: true,
    message: "Fetched all complaints",
    data: compList,
  });
});
