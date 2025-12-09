// routes/userManagementRoutes.js
const express = require('express');
const router = express.Router();

const userManagementController = require('../controllers/userManagementController');

router.get('/users', userManagementController.getUsersWithStats);
router.post('/users', userManagementController.createUser);
router.put('/users/:id', userManagementController.updateUser);
router.delete('/users/:id', userManagementController.deleteUser);
router.patch('/users/:id/status', userManagementController.updateUserStatus);

module.exports = router;
