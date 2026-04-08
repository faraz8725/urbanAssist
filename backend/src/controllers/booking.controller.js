const Booking = require("../models/booking.model");

exports.createBooking = async (req, res) => {
  try {
    const { user, service, date } = req.body;

    const booking = await Booking.create({
      user,
      service,
      date
    });

    res.json(booking);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getBookings = async (req, res) => {
  const bookings = await Booking.find()
    .populate("user")
    .populate("service");

  res.json(bookings);
};