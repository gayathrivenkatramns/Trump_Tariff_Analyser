// Tariff-Analyser-Api/routes/industryRoutes.js
const express = require('express');
const router = express.Router();
const industryController = require('../controllers/industryController');

// basic lists
router.get('/hts-full', industryController.getAllHts);
router.get('/country-currency', industryController.getAllCountryCurrency);

// analytics
router.get('/industry/trend', industryController.getTariffTrend);
router.get('/industry/distribution', industryController.getIndustryDistribution);
router.get('/industry/hts-codes', industryController.getHtsCodes);
router.get('/industry/sub-industry-duties', industryController.getSubIndustryDuties);

// dropdown helpers
router.get('/currencies', industryController.getCurrencies);
router.get('/countries-list', industryController.getCountriesList);
router.get('/industries-list', industryController.getIndustriesList);
router.get('/sub-industries-list', industryController.getSubIndustriesList);
router.get('/hts-codes-list', industryController.getHtsCodesList);

module.exports = router;
