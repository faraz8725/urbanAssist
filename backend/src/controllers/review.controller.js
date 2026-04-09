const Review = require("../models/review.model");
const User = require("../models/user.model");

exports.addReview = async (req, res) => {
  try {
    const { providerId, rating, comment, bookingId } = req.body;
    const review = await Review.create({
      reviewer: req.user.id,
      provider: providerId,
      booking: bookingId,
      rating,
      comment
    });

    // Update provider's average rating
    const reviews = await Review.find({ provider: providerId });
    const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    await User.findByIdAndUpdate(providerId, { rating: avg.toFixed(1), totalReviews: reviews.length });

    await review.populate("reviewer", "name");
    res.json(review);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getProviderReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ provider: req.params.providerId })
      .populate("reviewer", "name")
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ error: "Review not found" });
    const uid = req.user.id;
    if (review.reviewer.toString() !== uid && review.provider.toString() !== uid)
      return res.status(403).json({ error: "Not authorized" });
    await review.deleteOne();
    // Recalculate provider rating
    const reviews = await Review.find({ provider: review.provider });
    const avg = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;
    await User.findByIdAndUpdate(review.provider, { rating: avg.toFixed(1), totalReviews: reviews.length });
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
