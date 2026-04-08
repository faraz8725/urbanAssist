const router = require("express").Router();
const { addReview, getProviderReviews } = require("../controllers/review.controller");
const auth = require("../middleware/auth.middleware");

router.post("/", auth, addReview);
router.get("/:providerId", getProviderReviews);

module.exports = router;
