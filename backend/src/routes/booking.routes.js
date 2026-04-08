const router = require("express").Router();
const { createBooking, getBookings } = require("../controllers/booking.controller");

router.post("/create", createBooking);
router.get("/", getBookings);

module.exports = router;