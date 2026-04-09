const router = require("express").Router();
const { createService, getAllServices, getServiceById, getProviders, getProviderById, updateService, deleteService } = require("../controllers/service.controller");
const auth = require("../middleware/auth.middleware");

router.get("/", getAllServices);
router.get("/providers", getProviders);
router.get("/providers/:id", getProviderById);
router.get("/:id", getServiceById);
router.post("/", auth, createService);
router.put("/:id", auth, updateService);
router.delete("/:id", auth, deleteService);

module.exports = router;
