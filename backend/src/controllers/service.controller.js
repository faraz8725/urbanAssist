const Service = require("../models/service.model");

exports.createService = async (req, res) => {
  try {
    const { title, description, category, price, provider } = req.body;

    const service = await Service.create({
      title,
      description,
      category,
      price,
      provider
    });

    res.json(service);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllServices = async (req, res) => {
  const services = await Service.find().populate("provider");
  res.json(services);
};