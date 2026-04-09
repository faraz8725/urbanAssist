const router = require("express").Router();
const { addReview, getProviderReviews, deleteReview } = require("../controllers/review.controller");
const auth = require("../middleware/auth.middleware");

router.post("/", auth, addReview);
router.get("/:providerId", getProviderReviews);
router.delete("/:id", auth, deleteReview);

module.exports = router;
