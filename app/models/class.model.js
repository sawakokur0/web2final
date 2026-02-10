const mongoose = require("mongoose");

const ClassSchema = new mongoose.Schema({
  title: { type: String, required: true }, 
  trainer: { type: String, required: true },
  date: { type: Date, required: true },
  duration: { type: Number, default: 60 },
  capacity: { type: Number, default: 20 },
  enrolled: { type: Number, default: 0 },
  description: String
});

module.exports = mongoose.model("Class", ClassSchema);