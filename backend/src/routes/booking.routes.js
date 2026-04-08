const router = require("express").Router();
const { createBooking, getMyBookings, getProviderBookings, updateBookingStatus } = require("../controllers/booking.controller");
const auth = require("../middleware/auth.middleware");

router.post("/", auth, createBooking);
router.get("/my", auth, getMyBookings);
router.get("/provider", auth, getProviderBookings);
router.patch("/:id/status", auth, updateBookingStatus);

module.exports = router;
