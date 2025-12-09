// server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

const { sequelize, User } = require('./models');

const adminRoutes = require('./routes/adminRoutes');             // admin login/register
const userRoutes = require('./routes/userRoutes');               // user login/register
const authRoutes = require('./routes/authRoutes');               // shared login if needed
const forexRoutes = require('./routes/forexRoutes');             // forex APIs
const userManagementRoutes = require('./routes/userManagementRoutes'); // /users CRUD
const productRoutes = require('./routes/productRoutes');
const agreementRoutes = require('./routes/agreementRoutes');     // NEW

dotenv.config();

const app = express();

// ---------- Global middleware ----------
app.use(cors());
app.use(express.json());

// Health check
app.get('/', (req, res) => {
  res.json({
    message: 'Tariff-Analyser API is running',
    endpoints: {
      admin: '/api/admin',
      user: '/api/user',
      auth: '/api/auth',
      products: '/api/products',
      agreements: '/api/agreements',
    },
  });
});

// Debug: Check if User model is loaded
app.get('/api/debug', (req, res) => {
  res.json({
    userModelLoaded: !!User,
    sequelizeConnected: !!sequelize,
    message: 'Debug info',
  });
});

// ---------- Mount APIs ----------
// IMPORTANT: base path must be /api/admin, not /api/admin/users
// Inside userManagementRoutes define paths like router.get('/users', ...), etc.
app.use('/api/admin', adminRoutes);
app.use('/api/admin', userManagementRoutes);

app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/forex', forexRoutes);
app.use('/api/products', productRoutes);
app.use('/api/agreements', agreementRoutes);

// ---------- Start server ----------
const PORT = process.env.PORT || 5000;

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
