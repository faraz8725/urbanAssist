
/*const express = require("express");
const app = express();


app.use(express.json());


app.get("/", (req, res) => {
  res.send("Hello World!");
});

module.exports = app;  */

const express = require("express");
const cors = require("cors");

const app = express();

// middleware
app.use(express.json());
app.use(cors());

// routes
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/services", require("./routes/service.routes"));
app.use("/api/bookings", require("./routes/booking.routes"));

// test route
app.get("/", (req, res) => {
  res.send("API running 🚀");
});

module.exports = app;