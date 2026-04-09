const Service = require("../models/service.model");

exports.createService = async (req, res) => {
  try {
    const { title, description, category, price, location, timeSlots } = req.body;
    const service = await Service.create({
      title, description, category, price, location,
      timeSlots: timeSlots || [],
      provider: req.user.id
    });
    await service.populate("provider", "name rating totalReviews location");
    res.json(service);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllServices = async (req, res) => {
  try {
    const { search, category, location } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (location) filter.location = new RegExp(location, "i");
    if (search) filter.$or = [
      { title: new RegExp(search, "i") },
      { description: new RegExp(search, "i") },
      { category: new RegExp(search, "i") }
    ];
    const services = await Service.find(filter).populate("provider", "name rating totalReviews location phone");
    res.json(services);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id).populate("provider", "name rating totalReviews location phone bio skills");
    if (!service) return res.status(404).json({ error: "Service not found" });
    res.json(service);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getProviders = async (req, res) => {
  try {
    const User = require("../models/user.model");
    const { category, location, search } = req.query;
    const filter = { role: { $ne: "customer" } };
    if (category) filter.role = category;
    if (location) filter.location = new RegExp(location, "i");
    if (search) filter.$or = [
      { name: new RegExp(search, "i") },
      { skills: new RegExp(search, "i") }
    ];
    const providers = await User.find(filter).select("-password");
    res.json(providers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getProviderById = async (req, res) => {
  try {
    const User = require("../models/user.model");
    const provider = await User.findById(req.params.id).select("-password");
    if (!provider) return res.status(404).json({ error: "Provider not found" });
    const services = await Service.find({ provider: req.params.id });
    res.json({ provider, services });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ error: "Service not found" });
    if (service.provider.toString() !== req.user.id)
      return res.status(403).json({ error: "Not authorized" });
    const updated = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ error: "Service not found" });
    if (service.provider.toString() !== req.user.id)
      return res.status(403).json({ error: "Not authorized" });
    await service.deleteOne();
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
