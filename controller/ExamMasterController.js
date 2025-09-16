// ExamMasterController.js
import { ExamMaster } from "../models/ExamMaster.js";
import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import status from "http-status";
import errorHandler from "../utils/ErrorHandler.js";

// Create a new exam
export const createExam = catchAsyncErrors(async (req, res, next) => {
  const { name } = req.body;
  if (!name) return next(errorHandler("Name is required", 400));
  const exam = await ExamMaster.create({ name });
  res.status(status.CREATED).json({
    success: true,
    message: "Exam created successfully",
    data: exam,
  });
});

export const createBulkExam = catchAsyncErrors(async (req, res, next) => {
  const { names } = req.body;
  if (!Array.isArray(names) || names.length === 0)
    return next(errorHandler("Array of names is required", 400));

  const inserted = await ExamMaster.insertMany(names.map((name) => ({ name })));
  res.status(status.CREATED).json({
    success: true,
    message: `${inserted.length} examinations created successfully`,
    data: inserted,
  });
});



// Get all exams
export const getAllExam = catchAsyncErrors(async (req, res, next) => {
  const examList = await ExamMaster.find({});
  res.status(status.OK).json({
    success: true,
    message: "Fetched all exams",
    data: examList,
  });
});
