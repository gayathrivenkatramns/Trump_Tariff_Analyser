const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Admin, User } = require('../models');
require('dotenv').config();

const generateToken = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });

/**
 * POST /api/user/register
 * Optional separate user registration
 */
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, password: hash });
    res.status(201).json({ message: 'User created', id: user.id });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

/**
 * POST /api/user/login
 * User login for the "User Login" tab (email + password)
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt email:', email);

    const user = await User.findOne({ where: { email } });
    console.log('User found:', !!user);

    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, user.password);
    console.log('Password match:', ok);

    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

    const token = generateToken({ id: user.id, role: user.role || 'user' });
    res.json({ token });
  } catch (err) {
    console.error('Login error:', err);   // <- see real error in terminal
    res.status(500).json({ error: 'Server error' });
  }
};



/**
 * POST /api/auth/signup
 * Shared signup endpoint: creates Admin or User based on role
 * Body: { email, password, role } where role is 'admin' | 'analyst' | 'user'
 */
exports.signup = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res
        .status(400)
        .json({ error: 'Email, password and role are required' });
    }

    const hash = await bcrypt.hash(password, 10);

    // Create admin in Admin table
    if (role === 'admin') {
      const admin = await Admin.create({
        companyName: 'Default Company',
        email,
        password: hash,
      });
      return res
        .status(201)
        .json({ message: 'Admin created', role: 'admin', id: admin.id });
    }

    // Create user/analyst in Users table
    const username = email.split('@')[0];
    const user = await User.create({
      username,
      email,
      password: hash,
      role,
    });

    res
      .status(201)
      .json({ message: 'User created', role: user.role, id: user.id });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
