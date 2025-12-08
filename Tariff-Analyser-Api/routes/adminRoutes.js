const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// /api/admin/register
router.post('/register', adminController.register);

// /api/admin/login
router.post('/login', adminController.login);

module.exports = router;
