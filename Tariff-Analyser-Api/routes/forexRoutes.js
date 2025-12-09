// routes/forexRoutes.js
const express = require('express');
const router = express.Router();
const forexController = require('../controllers/forexController');

// simple currencies list for dropdowns
router.get('/currencies', (req, res) => {
  const currencies = {
    USD: 'US Dollar',
    EUR: 'Euro',
    GBP: 'British Pound',
    INR: 'Indian Rupee',
    JPY: 'Japanese Yen',
    AUD: 'Australian Dollar',
    CAD: 'Canadian Dollar',
    CHF: 'Swiss Franc',
    CNY: 'Chinese Yuan',
    SGD: 'Singapore Dollar',
    NZD: 'New Zealand Dollar',
    ZAR: 'South African Rand',
    BRL: 'Brazilian Real',
    HKD: 'Hong Kong Dollar',
    SEK: 'Swedish Krona',
    NOK: 'Norwegian Krone',
    DKK: 'Danish Krone',
    MXN: 'Mexican Peso',
    KRW: 'South Korean Won',
    TRY: 'Turkish Lira',
    SAR: 'Saudi Riyal',
    AED: 'UAE Dirham',
  };

  res.json({ currencies });
});

// main analysis endpoint
router.post('/analyze', forexController.analyze);

module.exports = router;
