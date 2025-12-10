// routes/countryRoutes.js
const express = require("express");
const router = express.Router();

// Import models and Sequelize helpers
const { Country, Sequelize } = require("../models"); // adjust path if needed
const { Op } = Sequelize;

// GET /api/countries
router.get("/", async (req, res) => {
  try {
    const { region, search } = req.query;

    const where = {};

    // Region filter
    if (region && region !== "All") {
      where.region = region;
    }

    // Search filter (country_name / iso_code / currency)
    if (search) {
      where[Op.or] = [
        { country_name: { [Op.like]: `%${search}%` } },
        { iso_code: { [Op.like]: `%${search}%` } },
        { currency: { [Op.like]: `%${search}%` } },
      ];
    }

    const countries = await Country.findAll({
      attributes: [
        "id",
        "country_name",
        "iso_code",
        "currency",
        "region",
        "status",
        "eligibility_criteria",
      ],
      where,
      order: [["country_name", "ASC"]],
    });

    res.json(countries);
  } catch (err) {
    console.error("GET /api/countries error", err);
    res.status(500).json({ error: "Server error" });
  }
});

// POST /api/countries
router.post("/", async (req, res) => {
  try {
    const country = await Country.create(req.body);
    res.status(201).json(country);
  } catch (err) {
    console.error("POST /api/countries error", err);
    res.status(500).json({ error: "Server error" });
  }
});

// PUT /api/countries/:id
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Country.update(req.body, { where: { id } });
    res.json({ success: true });
  } catch (err) {
    console.error("PUT /api/countries/:id error", err);
    res.status(500).json({ error: "Server error" });
  }
});

// DELETE /api/countries/:id
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Country.destroy({ where: { id } });
    res.json({ success: true });
  } catch (err) {
    console.error("DELETE /api/countries/:id error", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
