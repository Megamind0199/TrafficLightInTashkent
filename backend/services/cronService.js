const TrafficLight = require("../models/TrafficLight");
const { getTrafficLevel } = require("./orsService");
const { getWeatherCondition } = require("./weatherService");
const adjustTimings = require("../utils/adjustTiming"); 
const isHoliday = require("../utils/isHoliday");

function getNearbyPoint(lat, lng, distanceInMeters = 1000) {
  const earthRadius = 6371000;
  const deltaLat = (distanceInMeters / earthRadius) * (180 / Math.PI);
  const deltaLng = deltaLat / Math.cos(lat * (Math.PI / 180));
  return {
    lat: lat - deltaLat,
    lng: lng - deltaLng,
  };
}

function chunkArray(array, size) {
  return Array.from({ length: Math.ceil(array.length / size) }, (_, i) =>
      array.slice(i * size, i * size + size)
  );
}

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const switchTrafficLights = async () => {
  try {
    const lights = await TrafficLight.find();
    const holidayToday = isHoliday();
    
    console.log("🔁 Svetaforlar yangilanmoqda:", lights.length);

    const lightChunks = chunkArray(lights, 10);

    for (const chunk of lightChunks) {
      await Promise.all(
          chunk.map(async (light) => {
            try {
              const { lat: endLat, lng: endLng } = getNearbyPoint(
                  light.location.lat,
                  light.location.lng
              );

              const traffic = await getTrafficLevel(
                  light.location.lat,
                  light.location.lng,
                  endLat,
                  endLng
              );

              const weather = await getWeatherCondition(
                  light.location.lat,
                  light.location.lng
              );

              
              const { greenTime, redTime } = adjustTimings(traffic, weather , holidayToday);

              light.greenTime = greenTime;
              light.redTime = redTime;
              light.status = traffic === "high" ? "green" : "red";
              light.lastUpdated = Date.now();

              await light.save();

              if (global.io) {
                global.io.emit("lightUpdated", {
                  _id: light._id,
                  greenTime,
                  redTime,
                  status: light.status,
                  location: light.location,
                });
              }

              console.log(`✅ ${light._id} yangilandi: 🚦 ${traffic}, 🌦 ${weather}`);
            } catch (innerErr) {
              console.warn(`⚠️ ${light._id} yangilanmadi:`, innerErr.message);
            }
          })
      );

      console.log("⏳ 10ta svetafor yangilandi. 5 soniya kutyapmiz...");
      await delay(5000);
    }

    console.log("✅ Barcha svetaforlar yangilandi (chunk + delay bilan)");
  } catch (err) {
    console.error("❌ switchTrafficLights xatolik:", err.message);
  }
};

module.exports = switchTrafficLights;
