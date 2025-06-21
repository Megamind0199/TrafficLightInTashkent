const mongoose = require("mongoose");

const TrafficLightSchema = new mongoose.Schema({
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  greenTime: {
    type: Number,
    required: true,
  },
  redTime: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["green", "red"],
    default: "red",
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("TrafficLight", TrafficLightSchema);
