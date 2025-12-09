// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { User } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// SIGNUP (create new user or admin)
router.post('/signup', async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    // check if email already exists
    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    // hash password
    const hash = await bcrypt.hash(password, 10);

    // create user row in Users table
    const user = await User.create({
      name,
      email,
      password: hash,
      role: role || 'User',   // 'Admin' / 'Analyst' / 'User'
      status: 'Active',
    });

    // create JWT
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    return res.status(201).json({ token, user });
  } catch (err) {
    console.error('Signup error:', err);
    return res.status(500).json({ error: 'Signup failed' });
  }
});

// LOGIN (user or admin)
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  console.log('Login body:', { email }); // debug

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // store login info in Users table
    user.lastLogin = new Date();
    user.status = 'Active';
    await user.save();

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // include updated lastLogin in response
    return res.json({ token, user });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Login failed' });
  }
});

module.exports = router;
