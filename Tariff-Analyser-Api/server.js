// server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

// Sequelize models
const { sequelize, User, Country } = require('./models');

// Existing routes
const adminRoutes = require('./routes/adminRoutes');                 // admin login/register
const userRoutes = require('./routes/userRoutes');                   // user login/register
const authRoutes = require('./routes/authRoutes');                   // shared login if needed
const forexRoutes = require('./routes/forexRoutes');                 // forex APIs
const userManagementRoutes = require('./routes/userManagementRoutes'); // /users CRUD
const productRoutes = require('./routes/productRoutes');
const agreementRoutes = require('./routes/agreementRoutes');         // agreements

// NEW: Country routes
const countryRoutes = require('./routes/countryRoutes');

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
      forex: '/api/forex',
      products: '/api/products',
      agreements: '/api/agreements',
      countries: '/api/countries',
    },
  });
});

// Debug: Check if models are loaded
app.get('/api/debug', (req, res) => {
  res.json({
    userModelLoaded: !!User,
    countryModelLoaded: !!Country,
    sequelizeConnected: !!sequelize,
    message: 'Debug info',
  });
});

// ---------- Mount APIs ----------
app.use('/api/admin', adminRoutes);
app.use('/api/admin', userManagementRoutes);

app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/forex', forexRoutes);
app.use('/api/products', productRoutes);
app.use('/api/agreements', agreementRoutes);

// NEW: Countries API (list, filter, search)
app.use('/api/countries', countryRoutes);

const PORT = process.env.PORT || 5000;

// ---------- Start server ----------
sequelize
  .sync() // or .sync({ alter: true }) only in dev if you want auto‑altering
  .then(() => {
    console.log('✓ DB synced');
    console.log('✓ User model loaded:', !!User);
    console.log('✓ Country model loaded:', !!Country);
    app.listen(PORT, () => {
      console.log(`✓ Server running on port ${PORT}`);
      console.log(`✓ Try: http://localhost:${PORT}/api/countries`);
    });
  })
  .catch((err) => {
    console.error('✗ DB error:', err.message);
    process.exit(1);
  });

module.exports = app;
