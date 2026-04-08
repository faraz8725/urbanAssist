// dbConfig.js
const mongoose = require("mongoose");
require('dotenv').config();

const dbURL = process.env.DB_URL;

const connectDB = async () => {
  try {
    if(!dbURL) throw new Error("DB_URL is undefined in .env");
    
    // v7+ me options remove kar do
    await mongoose.connect(dbURL);  
    console.log("MongoDB connected successfully ✅");
  } catch (error) {
    console.error("MongoDB connection failed ❌", error);
    process.exit(1);
  }
};

module.exports = connectDB;