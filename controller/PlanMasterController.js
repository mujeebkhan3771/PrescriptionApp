import { PlanMaster } from "../models/PlanMaster.js";
import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import status from "http-status";
import errorHandler from "../utils/ErrorHandler.js";

// Create a new plan
export const createPlan = catchAsyncErrors(async (req, res, next) => {
  const { name } = req.body;
  if (!name) return next(errorHandler("Name is required", 400));
  const plan = await PlanMaster.create({ name });
  res.status(status.CREATED).json({
    success: true,
    message: "Plan created successfully",
    data: plan,
  });
});

export const createBulkPlan = catchAsyncErrors(async (req, res, next) => {
  const { names } = req.body;
  if (!Array.isArray(names) || names.length === 0)
    return next(errorHandler("Array of names is required", 400));

  const inserted = await PlanMaster.insertMany(names.map((name) => ({ name })));
  res.status(status.CREATED).json({
    success: true,
    message: `${inserted.length} plans created successfully`,
    data: inserted,
  });
});


// Get all plans
export const getAllPlan = catchAsyncErrors(async (req, res, next) => {
  const planList = await PlanMaster.find({});
  res.status(status.OK).json({
    success: true,
    message: "Fetched all plans",
    data: planList,
  });
});
