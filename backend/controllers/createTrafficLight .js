const TrafficLight = require("../models/TrafficLight");

const createTrafficLight = async (req, res) => {
  const { lat, lng, greenTime, redTime } = req.body;

  if (!lat || !lng) {
    return res.status(400).json({ message: "Joylashuv yetarli emas" });
  }

  try {
    const newLight = new TrafficLight({
      location: { lat, lng },
      greenTime,
      redTime,
      status: "green",
    });

    await newLight.save();

    res.status(201).json({
      message: "Svetafor muvaffaqiyatli qo‘shildi ✅",
      data: newLight,
    });
  } catch (err) {
    console.error("createTrafficLight error:", err.message);
    res.status(500).json({ message: "Xatolik yuz berdi" });
  }
};

module.exports = { createTrafficLight };
