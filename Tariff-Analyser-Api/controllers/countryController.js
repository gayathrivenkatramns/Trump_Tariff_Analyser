const { Country } = require('../models');

exports.getAll = async (req, res) => {
  try {
    const { region, search } = req.query;

    const where = {};
    if (region && region !== 'All') where.region = region;
    if (search) {
      where[Country.sequelize.Op.or] = [
        { country_name: { [Country.sequelize.Op.like]: `%${search}%` } },
        { iso_code: { [Country.sequelize.Op.like]: `%${search}%` } },
        { currency: { [Country.sequelize.Op.like]: `%${search}%` } },
      ];
    }

    const countries = await Country.findAll({ where, order: [['country_name', 'ASC']] });
    res.json(countries);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
