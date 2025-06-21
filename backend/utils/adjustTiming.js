function adjustTimings(trafficLevel, weather, isHoliday = false) {
    let green = 30;
    let red = 30;

    if (trafficLevel === "high") {
        green = 60;
        red = 30;
    } else if (trafficLevel === "medium") {
        green = 45;
        red = 45;
    }

    if (["Rain", "Snow", "Fog", "Drizzle", "Thunderstorm"].includes(weather)) {
        green += 10;
        red += 5;
    }

    if (isHoliday) {
        green = Math.max(green - 10, 15);
        red = Math.min(red + 10, 90);
    }

    return {
        greenTime: Math.min(green, 90),
        redTime: Math.min(red, 90),
    };
}

module.exports = adjustTimings;
