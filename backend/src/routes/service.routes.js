const router = require("express").Router();
const { createService, getAllServices, getServiceById, getProviders, getProviderById } = require("../controllers/service.controller");
const auth = require("../middleware/auth.middleware");

router.get("/", getAllServices);
router.get("/providers", getProviders);
router.get("/providers/:id", getProviderById);
router.get("/:id", getServiceById);
router.post("/", auth, createService);

module.exports = router;
