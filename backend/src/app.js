const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/services", require("./routes/service.routes"));
app.use("/api/bookings", require("./routes/booking.routes"));
app.use("/api/reviews", require("./routes/review.routes"));

app.get("/", (req, res) => res.send("UrbanAssist API running 🚀"));

module.exports = app;
