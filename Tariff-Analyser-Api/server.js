// server.js
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');
const adminRoutes = require('./routes/adminRoutes');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');

require('dotenv').config();

const app = express();

// Global middleware
app.use(cors());
app.use(express.json());

// Health check (optional)
app.get('/', (req, res) => {
  res.json({ message: 'Tariff-Analyser API is running' });
});

// Mount APIs
app.use('/api/admin', adminRoutes); // admin login/register
app.use('/api/user', userRoutes);   // user login/register
app.use('/api/auth', authRoutes);   // shared signup

const PORT = process.env.PORT || 5000;

// Sync DB and start server
sequelize
  .sync()
  .then(() => {
    console.log('DB synced');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error('DB error', err));

module.exports = app;
