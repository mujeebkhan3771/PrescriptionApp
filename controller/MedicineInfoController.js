import { MedicineInfoMaster } from "../models/MedicineInfoMaster.js";
import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import errorHandler from "../utils/ErrorHandler.js";

export const getMedicineInfo = catchAsyncErrors(async (req, res, next) => {
  const { medicineId } = req.params;

  const data =
    (await MedicineInfoMaster.findById(medicineId)) ||
    (await MedicineInfoMaster.findOne({ _id: medicineId })) || 
    (await MedicineInfoMaster.findOne({ name: medicineId })); 

  if (!data) {
    return next(errorHandler("No data found for selected medicine", 404));
  }

  res.status(200).json({
    success: true,
    data,
  });
});

export const createOrUpdateMedicineInfo = catchAsyncErrors(
  async (req, res, next) => {
    const { name, dosage, days, remarks } = req.body;

    if (!name || !dosage || !days || !remarks) {
      return next(errorHandler("All fields are required", 400));
    }

    let existing = await MedicineInfoMaster.findOne({ name });

    if (existing) {
      existing.dosage = dosage;
      existing.days = days;
      existing.remarks = remarks;
      await existing.save();

      return res.status(200).json({
        success: true,
        message: "Updated medicine info",
        data: existing,
      });
    }

    const created = await MedicineInfoMaster.create({
      name,
      dosage,
      days,
      remarks,
    });

    res.status(201).json({
      success: true,
      message: "Created medicine info",
      data: created,
    });
  }
);

export const getAllMedicineInfo = catchAsyncErrors(async (req, res, next) => {
  const data = await MedicineInfoMaster.find({});

  res.status(200).json({
    success: true,
    count: data.length,
    data,
  });
});

// Create bulk medicines from an array of names (strings)
export const createBulkMedicines = catchAsyncErrors(async (req, res, next) => {
  const { names } = req.body;

  if (!Array.isArray(names) || names.length === 0) {
    return next(errorHandler("Medicine names are required", 400));
  }

  // Remove duplicates & trim whitespace
  const cleanNames = [
    ...new Set(names.map((name) => name.trim()).filter(Boolean)),
  ];

  // Find existing medicines that match by name
  const existing = await MedicineInfoMaster.find({
    name: { $in: cleanNames },
  }).lean();
  const existingNames = existing.map((item) => item.name);

  // Filter names that aren't in the database yet
  const newNames = cleanNames.filter((name) => !existingNames.includes(name));

  const inserted = await MedicineInfoMaster.insertMany(
    newNames.map((name) => ({ name })),
    { ordered: false }
  );

  res.status(201).json({
    success: true,
    data: inserted,
    message: `${inserted.length} medicines added.`,
  });
});

export const searchMedicines = catchAsyncErrors(async (req, res, next) => {
  const { search } = req.query;

  const data = await MedicineInfoMaster.find({
    name: { $regex: search, $options: "i" }, 
  }).limit(10); // optional limit

  res.status(200).json({
    success: true,
    data,
  });
});