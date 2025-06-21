
const holidayDates = [
    "2025-01-01", // Yangi yil
    "2025-03-08", // Xotin-qizlar kuni
    "2025-03-21", // Navro'z
    "2025-05-09", // Xotira va qadrlash kuni
    "2025-09-01", // Mustaqillik kuni
    "2025-10-01", // O‘qituvchilar kuni
    "2025-12-08"  // Konstitutsiya kuni
];

function isHoliday(date = new Date()) {
    const today = date.toISOString().split("T")[0];
    return holidayDates.includes(today);
}

module.exports = isHoliday;
