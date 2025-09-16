import { MedicineInfoMaster } from "../models/MedicineInfoMaster.js";


export const buildCustomizedMedicineEntries = async (medicines) => {
  return await Promise.all(
    medicines.map(async (med, idx) => {
      console.log(`[Debug] Processing medicine[${idx}]:`, med);

      if (!med.name?.trim()) {
        throw new Error(`Medicine name is required at index ${idx}`);
      }

      // Try to find medicine by ID or name
      let defaultInfo = med.medicineId
        ? await MedicineInfoMaster.findById(med.medicineId)
        : await MedicineInfoMaster.findOne({ name: med.name });

     
      if (!defaultInfo) {
        defaultInfo = await MedicineInfoMaster.create({
          name: med.name,
          dosage: med.dosage || "",
          days: med.days || "",
          remarks: med.remarks || "",
        });

        console.log(`[Info] Created new medicine entry: ${defaultInfo.name}`);
      }

  
      return {
        medicineId: defaultInfo._id,
        name: med.name || defaultInfo.name,
        dosage: med.dosage || defaultInfo.dosage,
        days: med.days || defaultInfo.days,
        remarks: med.remarks || defaultInfo.remarks,
      };
    })
  );
};


