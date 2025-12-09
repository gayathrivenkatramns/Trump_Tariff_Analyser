const db = require("../models");
const UserRole = db.UserRole;

exports.create = async (req, res) => {
  try {
    const row = await UserRole.create(req.body);
    res.status(201).json(row);
  } catch (err) {
    res.status(500).json({ message: err.message || "Error creating user" });
  }
};

exports.findAll = async (_req, res) => {
  try {
    const rows = await UserRole.findAll();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message || "Error retrieving users" });
  }
};

exports.findOne = async (req, res) => {
  try {
    const row = await UserRole.findByPk(req.params.id);
    if (!row) return res.status(404).json({ message: "User not found" });
    res.json(row);
  } catch (err) {
    res.status(500).json({ message: err.message || "Error retrieving user" });
  }
};

exports.update = async (req, res) => {
  try {
    const [rows] = await UserRole.update(req.body, {
      where: { id: req.params.id }
    });
    if (rows === 0) return res.status(404).json({ message: "User not found" });
    const updated = await UserRole.findByPk(req.params.id);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message || "Error updating user" });
  }
};

exports.delete = async (req, res) => {
  try {
    const rows = await UserRole.destroy({ where: { id: req.params.id } });
    if (rows === 0) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message || "Error deleting user" });
  }
};
