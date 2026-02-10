const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  class: { type: mongoose.Schema.Types.ObjectId, ref: "Class" },
  bookedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Booking", BookingSchema);