const Booking = require("../models/booking.model");
const Service = require("../models/service.model");

exports.createBooking = async (req, res) => {
  try {
    const { serviceId, date, timeSlot, note } = req.body;
    const service = await Service.findById(serviceId);
    if (!service) return res.status(404).json({ error: "Service not found" });

    const booking = await Booking.create({
      customer: req.user.id,
      service: serviceId,
      provider: service.provider,
      date,
      timeSlot,
      note
    });
    await booking.populate([
      { path: "service", select: "title category price" },
      { path: "provider", select: "name phone" }
    ]);
    res.json(booking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ customer: req.user.id })
      .populate("service", "title category price")
      .populate("provider", "name phone")
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getProviderBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ provider: req.user.id })
      .populate("service", "title category price")
      .populate("customer", "name phone")
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateBookingStatus = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.json(booking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
