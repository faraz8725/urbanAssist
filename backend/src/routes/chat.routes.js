const router = require("express").Router();
const { getOrCreateChat, getMyChats } = require("../controllers/chat.controller");
const auth = require("../middleware/auth.middleware");

router.get("/", auth, getMyChats);
router.get("/:providerId", auth, getOrCreateChat);

module.exports = router;
