// controllers/userManagementController.js
const { User, Sequelize } = require('../models');
const { Op } = Sequelize;

// GET /api/admin/users
const getUsersWithStats = async (req, res) => {
  try {
    const users = await User.findAll({ order: [['createdAt', 'DESC']] });

    const totalUsers = await User.count();
    const activeUsers = await User.count({ where: { status: 'Active' } });
    const admins = await User.count({ where: { role: 'Admin' } });

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const newThisMonth = await User.count({
      where: { createdAt: { [Op.gte]: startOfMonth } },
    });

    res.json({ users, stats: { totalUsers, activeUsers, admins, newThisMonth } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to load users' });
  }
};

// POST /api/admin/users
const createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create user' });
  }
};

// PUT /api/admin/users/:id
const updateUser = async (req, res) => {
  try {
    await User.update(req.body, { where: { id: req.params.id } });
    const updated = await User.findByPk(req.params.id);
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update user' });
  }
};

// DELETE /api/admin/users/:id
const deleteUser = async (req, res) => {
  try {
    await User.destroy({ where: { id: req.params.id } });
    res.status(204).end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete user' });
  }
};

// PATCH /api/admin/users/:id/status
const updateUserStatus = async (req, res) => {
  try {
    await User.update(
      { status: req.body.status },
      { where: { id: req.params.id } }
    );
    const updated = await User.findByPk(req.params.id);
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update status' });
  }
};

module.exports = {
  getUsersWithStats,
  createUser,
  updateUser,
  deleteUser,
  updateUserStatus,
};
