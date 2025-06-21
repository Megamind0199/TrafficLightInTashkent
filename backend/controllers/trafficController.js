const TrafficLight = require("../models/TrafficLight");

const getAllTrafficLights = async (req, res) => {
  try {
    const lights = await TrafficLight.find().sort({ lastUpdated: -1 });
    
    res.status(200).json(lights);
  } catch (err) {
    console.error("TrafficLightlarni olishda xatolik:", err.message);
    res.status(500).json({ message: "Bazadan ma'lumotlarni olishda xato" });
  }
};

module.exports = { getAllTrafficLights };
