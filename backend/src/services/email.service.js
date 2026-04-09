const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

async function sendBookingEmail(to, bookingDetails) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: to,
    subject: "New Booking Received 🚀",
    html: `
      <h2>New Booking Alert</h2>
      <p><b>Customer:</b> ${bookingDetails.customerName}</p>
      <p><b>Date:</b> ${bookingDetails.date}</p>
      <p><b>Time:</b> ${bookingDetails.timeSlot}</p>
      <p><b>Service:</b> ${bookingDetails.service}</p>
    `
  };

  await transporter.sendMail(mailOptions);
}

module.exports = sendBookingEmail;