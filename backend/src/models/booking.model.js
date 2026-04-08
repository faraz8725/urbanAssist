const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Service"
  },

  date: String,
  status: {
    type: String,
    enum: ["pending", "completed"],
    default: "pending"
  }

}, { timestamps: true });

module.exports = mongoose.model("Booking", bookingSchema);