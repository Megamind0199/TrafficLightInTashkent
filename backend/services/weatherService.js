const axios = require("axios");

const getWeatherCondition = async (lat, lon) => {
    const apiKey = process.env.WEATHER_API_KEY; 
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;

    try {
        const res = await axios.get(url);
        const condition = res.data.weather[0].main; 
        console.log("🌦 Ob-havo:", condition);
        return condition;
    } catch (err) {
        console.error("❌ Ob-havo ma’lumotini olishda xatolik:", err.message);
        return "Clear";
    }
};

module.exports = { getWeatherCondition };
