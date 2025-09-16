// InvestMasterController.js
import { InvestMaster } from "../models/InvestMaster.js";
import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import status from "http-status";
import errorHandler from "../utils/ErrorHandler.js";

// Create a new investigation
export const createInvest = catchAsyncErrors(async (req, res, next) => {
  const { name } = req.body;
  if (!name) return next(errorHandler("Name is required", 400));
  const invest = await InvestMaster.create({ name });
  res.status(status.CREATED).json({
    success: true,
    message: "Investigation created successfully",
    data: invest,
  });
});


export const createBulkInvest = catchAsyncErrors(async (req, res, next) => {
  const { names } = req.body;
  if (!Array.isArray(names) || names.length === 0)
    return next(errorHandler("Array of names is required", 400));

  const inserted = await InvestMaster.insertMany(
    names.map((name) => ({ name }))
  );
  res.status(status.CREATED).json({
    success: true,
    message: `${inserted.length} investigations created successfully`,
    data: inserted,
  });
});


// Get all investigations
export const getAllInvest = catchAsyncErrors(async (req, res, next) => {
  const investList = await InvestMaster.find({});
  res.status(status.OK).json({
    success: true,
    message: "Fetched all investigations",
    data: investList,
  });
});
