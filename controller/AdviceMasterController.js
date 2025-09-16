import { AdviceMaster } from "../models/AdviceMaster.js";
import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import status from "http-status";
import errorHandler from "../utils/ErrorHandler.js";

// Create a new advice
export const createAdvice = catchAsyncErrors(async (req, res, next) => {
  const { name } = req.body;
  if (!name) return next(errorHandler("Name is required", 400));
  const advice = await AdviceMaster.create({ name });
  res.status(status.CREATED).json({
    success: true,
    message: "Advice created successfully",
    data: advice,
  });
});

export const createBulkAdvice = catchAsyncErrors(async (req, res, next) => {
  const { names } = req.body;

  if (!Array.isArray(names) || names.length === 0) {
    return next(errorHandler("Array of names is required", 400));
  }

  const bulkAdvice = names.map((name) => ({ name }));
  const insertedAdvice = await AdviceMaster.insertMany(bulkAdvice);

  res.status(status.CREATED).json({
    success: true,
    message: `${insertedAdvice.length} advice items created successfully`,
    data: insertedAdvice,
  });
});


// Get all advice
export const getAllAdvice = catchAsyncErrors(async (req, res, next) => {
  const adviceList = await AdviceMaster.find({});
  res.status(status.OK).json({
    success: true,
    message: "Fetched all advice",
    data: adviceList,
  });
});
