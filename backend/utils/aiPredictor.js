// utils/aiPredictor.js

function predictGreenTime(traffic, hour) {
  
  let greenTime =
    20 +
    traffic * 5 +
    (hour >= 7 && hour <= 9 ? 10 : 0) +
    (hour >= 17 && hour <= 19 ? 10 : 0);
  greenTime = Math.min(greenTime, 90); 
  return greenTime;
}

function predictRedTime(greenTime) {
  return Math.max(20, 120 - greenTime);
}

module.exports = { predictGreenTime, predictRedTime };
