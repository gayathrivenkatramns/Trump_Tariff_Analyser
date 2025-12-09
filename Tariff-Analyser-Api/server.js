// server.js
const express = require('express');
const cors = require('cors');
const { sequelize, User } = require('./models');
const adminRoutes = require('./routes/adminRoutes');            // admin login/register
const userRoutes = require('./routes/userRoutes');              // user login/register
const authRoutes = require('./routes/authRoutes');              // shared login if needed
const forexRoutes = require('./routes/forexRoutes');            // forex APIs
const userManagementRoutes = require('./routes/userManagementRoutes'); // /users CRUD

require('dotenv').config();

const app = express();

// Global middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'Tariff-Analyser API is running' });
});

// Debug: Check if User model is loaded
app.get('/api/debug', (req, res) => {
  res.json({
    userModelLoaded: !!User,
    sequelizeConnected: !!sequelize,
    message: 'Debug info',
  });
});

// Mount APIs
app.use('/api/admin', adminRoutes);          // e.g. POST /api/admin/login (old admin)
app.use('/api/user', userRoutes);            // e.g. POST /api/user/login (old user)
app.use('/api/auth', authRoutes);            // POST /api/auth/login (new shared login)
app.use('/api/forex', forexRoutes);

// IMPORTANT: base path must be /api/admin, not /api/admin/users
// Inside userManagementRoutes you should define paths like:
// router.get('/users', ...), router.post('/users', ...), etc.[web:96][web:99]
app.use('/api/admin', userManagementRoutes);

const PORT = process.env.PORT || 5000;

// Sync DB and start server
sequelize
  .sync()
  .then(() => {
    console.log('✓ DB synced');
    console.log('✓ User model loaded:', !!User);
    app.listen(PORT, () => {
      console.log(`✓ Server running on port ${PORT}`);
      console.log(`✓ Try: http://localhost:${PORT}/api/admin/users`);
    });
  })
  .catch((err) => {
    console.error('✗ DB error:', err.message);
    process.exit(1);
  });

module.exports = app;
