
require('dotenv').config();
const app = require("./src/app"); // path adjust karo agar app.js src folder me hai
const PORT = process.env.PORT || 3000;
const connectDB=require("./src/config/dbConfig")

connectDB();

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});