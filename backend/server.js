require('dotenv').config();
const app = require("./src/app");
const connectDB = require("./src/config/dbConfig");
const PORT = process.env.PORT || 5000;
console.log("DB_URL from env:", process.env.DB_URL);
connectDB();

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
