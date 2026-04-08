const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  phone: String,
  role: {
    type: String,
    enum: ["customer", "plumber", "electrician", "tutor", "delivery"],
    default: "customer"
  },
  skills: [String],
  location: String,
  price: Number,
  bio: String,
  rating: { type: Number, default: 0 },
  totalReviews: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
