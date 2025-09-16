import { RefbyMaster } from "../models/RefbyMaster.js";
import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import status from "http-status";
import errorHandler from "../utils/ErrorHandler.js";

// Create a new refby
export const createRefby = catchAsyncErrors(async (req, res, next) => {
  const { name } = req.body;

  if (!name) return next(errorHandler("Name is required", 400));

  const refby = await RefbyMaster.create({ name });

  res.status(status.CREATED).json({
    success: true,
    message: "Refby created successfully",
    data: refby,
  });
});

// Bulk create refby
export const createBulkRefby = catchAsyncErrors(async (req, res, next) => {
  const { names } = req.body;

  if (!Array.isArray(names) || names.length === 0) {
    return next(errorHandler("Array of names is required", 400));
  }

  const bulkRefby = names.map((name) => ({ name }));
  const inserted = await RefbyMaster.insertMany(bulkRefby);

  res.status(status.CREATED).json({
    success: true,
    message: `${inserted.length} refby created successfully`,
    data: inserted,
  });
});

// Get all refby
export const getAllRefby = catchAsyncErrors(async (req, res, next) => {
  const refbyList = await RefbyMaster.find({});
  res.status(status.OK).json({
    success: true,
    message: "Fetched all refby",
    data: refbyList,
  });
});
