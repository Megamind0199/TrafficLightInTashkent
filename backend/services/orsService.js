const axios = require("axios");

async function getTrafficLevel(startLat, startLng, endLat, endLng) {
  const apiKey = "5b3ce3597851110001cf624892de76dfc33347b7a580947a21a2e5d3";
  const url = "https://api.openrouteservice.org/v2/directions/driving-car";

  const body = {
    coordinates: [
      [startLng, startLat], 
      [endLng, endLat]
    ]
  };

  try {
    const res = await axios.post(url, body, {
      headers: {
        Authorization: apiKey,
        "Content-Type": "application/json",
      },
    });

    const segments = res.data.routes[0].segments;
    const duration = segments[0].duration;
    const distance = segments[0].distance;

    const avgSpeed = (distance / duration) * 3.6; 

    if (avgSpeed >= 40) return "low";
    if (avgSpeed >= 20) return "medium";
    return "high";

  } catch (err) {
    console.error("❌ OpenRouteService API error:", err.response?.data || err.message);
    return "medium";
  }
}

module.exports = { getTrafficLevel };
