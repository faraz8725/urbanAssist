/*const Booking = require("../models/booking.model");
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
*/

const Booking = require("../models/booking.model");
const Service = require("../models/service.model");
const User = require("../models/user.model");
const sendBookingEmail = require("../services/email.service");

// ✅ Create Booking + Send Email
exports.createBooking = async (req, res) => {
  try {
    const { serviceId, date, timeSlot, note } = req.body;

    // 🔍 Validate input
    if (!serviceId || !date || !timeSlot) {
      return res.status(400).json({
        error: "All fields are required"
      });
    }

    // 🔎 Find service
    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ error: "Service not found" });
    }

    // ❌ Check slot already booked
    const existingBooking = await Booking.findOne({
      service: serviceId,
      date,
      timeSlot
    });

    if (existingBooking) {
      return res.status(400).json({
        error: "This time slot is already booked"
      });
    }

    // ✅ Create booking
    const booking = await Booking.create({
      customer: req.user.id,
      service: serviceId,
      provider: service.provider,
      date,
      timeSlot,
      note
    });

    // 🔄 Populate
    await booking.populate([
      { path: "service", select: "title category price" },
      { path: "provider", select: "name email phone" }
    ]);

    // 📩 Send Email (background me)
    try {
      const provider = await User.findById(service.provider);

      if (provider?.email) {
        sendBookingEmail(provider.email, {
          customerName: req.user.name,
          date,
          timeSlot,
          service: service.title
        })
          .then(() => console.log("✅ Email sent"))
          .catch(err => console.log("❌ Email error:", err.message));
      }
    } catch (emailErr) {
      console.log("Email failed:", emailErr.message);
    }

    res.status(201).json({
      message: "Booking created successfully 🚀",
      booking
    });

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
};



// ✅ Customer bookings
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



// ✅ Provider bookings
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



// ✅ Update booking status
exports.updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({
        error: "Booking not found"
      });
    }

    res.json({
      message: "Status updated",
      booking
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};