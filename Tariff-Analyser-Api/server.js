// server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { sequelize } = require('./models');
const adminRoutes = require('./routes/adminRoutes');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes'); // Note capital R

dotenv.config();

const app = express();

// Global middleware
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
      products: '/api/products'
    }
  });
});

// Mount ALL APIs
app.use('/api/admin', adminRoutes);     // Admin login/register
app.use('/api/user', userRoutes);       // User login/register  
app.use('/api/auth', authRoutes);       // Shared signup
app.use('/api/products', productRoutes); // Product CRUD

const PORT = process.env.PORT || 5000;

// Sync DB and start server (ONCE)
sequelize
  .sync()
  .then(() => {
    console.log('✅ DB synced - All models loaded');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log('📋 Available: /api/admin, /api/user, /api/auth, /api/products');
    });
  })
  .catch((err) => {
    console.error('❌ DB sync failed:', err);
  });

module.exports = app;
