const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    unique: true
  },
  password: String,
  phone: String,

  role: {
    type: String,
    enum: ["customer", "plumber", "electrician", "teacher", "delivery"],
    default: "customer"
  },

  skills: [String], // e.g. ["pipe fixing", "wiring"]

  location: String,
  price: Number, // per hour/service

  rating: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);