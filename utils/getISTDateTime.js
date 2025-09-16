// utils/getISTDateTime.js
export const getISTDateTime = () => {
  const now = new Date();
  const istDate = now.toLocaleDateString("en-GB", { timeZone: "Asia/Kolkata" }); // dd/mm/yyyy
  const istTime = now.toLocaleTimeString("en-IN", {
    timeZone: "Asia/Kolkata",
    hour12: true,
  }); // hh:mm:ss AM/PM
  return { date: istDate, time: istTime };
};
