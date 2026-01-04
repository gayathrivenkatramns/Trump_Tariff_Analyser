// controllers/countryController.js
const { Country, Sequelize } = require('../models');
const { Op } = Sequelize;

// READ: list all (with optional filters)
exports.getAll = async (req, res) => {
  try {
    const { region, search } = req.query;
    const where = {};

    if (region && region !== 'All') {
      where.region = region;
    }

    if (search) {
      where[Op.or] = [
        { country_name: { [Op.like]: `%${search}%` } },
        { iso_code: { [Op.like]: `%${search}%` } },
        { currency: { [Op.like]: `%${search}%` } },
      ];
    }

    const countries = await Country.findAll({
      attributes: [
        'id',
        'country_name',
        'iso_code',
        'currency',
        'region',
        'status',
        'eligibility_criteria',
        'tariff_data_status',
      ],
      where,
      order: [['country_name', 'ASC']],
    }); // SELECT [web:58]

    res.json(countries);
  } catch (err) {
    console.error('GET /api/countries error', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// READ: single by id
exports.getById = async (req, res) => {
  try {
    const country = await Country.findByPk(req.params.id);
    if (!country) {
      return res.status(404).json({ error: 'Country not found' });
    }
    res.json(country);
  } catch (err) {
    console.error('GET /api/countries/:id error', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// CREATE
exports.createCountry = async (req, res) => {
  try {
    console.log('Create country body:', req.body);

    const country = await Country.create({
      country_name: req.body.country_name,
      iso_code: req.body.iso_code,
      currency: req.body.currency,
      region: req.body.region,
      status: req.body.status, // General | Special | Column2
      eligibility_criteria: req.body.eligibility_criteria || null,
      tariff_data_status: req.body.tariff_data_status || 'Incomplete',
    }); // INSERT [web:31][web:50]

    res.status(201).json(country);
  } catch (err) {
    console.error('POST /api/countries error', err);
    res.status(500).json({ error: err.message });
  }
};

// UPDATE
exports.updateCountry = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Update country id:', id, 'body:', req.body);

    const [count] = await Country.update(req.body, { where: { id } }); // UPDATE [web:43][web:58]

    if (count === 0) {
      return res.status(404).json({ error: 'Country not found or no changes' });
    }

    const updated = await Country.findByPk(id);
    res.json(updated);
  } catch (err) {
    console.error('PUT /api/countries/:id error', err);
    res.status(500).json({ error: err.message });
  }
};

// DELETE
exports.deleteCountry = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Delete country id:', id);

    const count = await Country.destroy({ where: { id } }); // DELETE [web:58]

    if (count === 0) {
      return res.status(404).json({ error: 'Country not found' });
    }

    res.json({ success: true, deleted: count });
  } catch (err) {
    console.error('DELETE /api/countries/:id error', err);
    res.status(500).json({ error: err.message });
  }
};
