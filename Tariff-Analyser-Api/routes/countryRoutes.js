// routes/countryRoutes.js
const express = require('express');
const router = express.Router();
const countryController = require('../controllers/countryController');

// C = create
router.post('/', countryController.createCountry);

// R = read all + read one
router.get('/', countryController.getAll);
router.get('/:id', countryController.getById);

// U = update
router.put('/:id', countryController.updateCountry);

// D = delete
router.delete('/:id', countryController.deleteCountry);

module.exports = router;
