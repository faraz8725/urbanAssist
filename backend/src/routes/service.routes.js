const router = require("express").Router();
const { createService, getAllServices } = require("../controllers/service.controller");

router.post("/create", createService);
router.get("/", getAllServices);

module.exports = router;