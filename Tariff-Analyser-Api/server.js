const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { sequelize } = require("./models");

// Route modules that already exist
const adminRoutes = require("./routes/adminRoutes");        // admin login/dashboard
const userRoutes = require("./routes/userRoutes");          // user login/dashboard
const authRoutes = require("./routes/authRoutes");          // shared signup/login
const productRoutes = require("./routes/productRoutes");    // product / library

// Your user management routes (User_role CRUD)
const userRoleRoutes = require("./routes/userRole.routes"); // userRole.routes.js

dotenv.config();

const app = express();

// ---------- Global middleware ----------
app.use(cors());
app.use(express.json());

// ---------- Health check ----------
app.get("/", (req, res) => {
  res.json({
    message: "Tariff-Analyser API is running",
    endpoints: {
      admin: "/api/admin",
      user: "/api/user",
      auth: "/api/auth",
      products: "/api/products",
      userManagement: "/api/users"
    }
  });
});

// ---------- Mount ALL APIs ----------
app.use("/api/admin", adminRoutes);       // Admin login/register + dashboards
app.use("/api/user", userRoutes);         // User login/register + dashboards
app.use("/api/auth", authRoutes);         // Shared signup/login
app.use("/api/products", productRoutes);  // Product CRUD

// User Management (User_role table) used by your React User Management page
// Routes inside userRole.routes.js are: GET /, POST /, GET /:id, PUT /:id, DELETE /:id
app.use("/api/users", userRoleRoutes);

// ---------- Start server ----------
const PORT = process.env.PORT || 5000;

sequelize
  .sync()
  .then(() => {
    console.log("✅ DB synced - All models loaded");
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(
        "📋 Available: /api/admin, /api/user, /api/auth, /api/products, /api/users"
      );
    });
  })
  .catch((err) => {
    console.error("❌ DB sync failed:", err);
  });

module.exports = app;
