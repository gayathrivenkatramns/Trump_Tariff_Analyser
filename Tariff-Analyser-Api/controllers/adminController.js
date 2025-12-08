const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Admin } = require('../models');
require('dotenv').config();

const generateToken = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });

// POST /api/admin/register
exports.register = async (req, res) => {
  try {
    const { companyName, email, password } = req.body;

    // optionally check for existing email
    const existing = await Admin.findOne({ where: { email } });
    if (existing) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const hash = await bcrypt.hash(password, 10);
    const admin = await Admin.create({
      companyName,
      email,
      password: hash,
    });

    res.status(201).json({ message: 'Admin created', id: admin.id });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// POST /api/admin/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login body:', req.body);   // debug

    const admin = await Admin.findOne({ where: { email } });
    console.log('Found admin:', admin && admin.toJSON()); // debug

    if (!admin) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const ok = await bcrypt.compare(password, admin.password);
    if (!ok) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken({ id: admin.id, role: 'admin' });
    res.json({ token });
  } catch (err) {
    console.error('Admin login error:', err);  // see stack trace
    res.status(500).json({ error: 'Server error' });
  }
};
