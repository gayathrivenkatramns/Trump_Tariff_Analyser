// src/components/AdminDashboardPage.js
import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FiPieChart,
  FiUsers,
  FiFileText,
  FiGlobe,
  FiBox,
  FiBarChart2,
  FiBell,
  FiMessageSquare,
  FiLogOut,
} from "react-icons/fi";
import "../App.css";

function AdminDashboardPage() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/"); // back to login shell
  };

  // Mock numbers – later replace with real API data
  const totalUsers = 1247;
  const activeSessions = 178;
  const totalQueries = 45892;
  const systemHealth = 98.2;

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="sidebar admin-sidebar">
        <div className="sidebar-header">
          <div className="sidebar-logo-circle">TI</div>
          <div className="sidebar-title">TariffIntel</div>
        </div>

        <nav className="sidebar-nav">
          <button className="nav-item active" type="button">
            <span className="nav-icon">
              <FiPieChart />
            </span>
            <span className="nav-label">Admin Dashboard</span>
          </button>

          {/* GO TO /admin/users */}
          <button
            className="nav-item"
            type="button"
            onClick={() => navigate("/admin/users")}
          >
            <span className="nav-icon">
              <FiUsers />
            </span>
            <span className="nav-label">User Management</span>
          </button>

           {/* 🔥 Agreements Navigation Added */}
          <button
            className="nav-item"
            type="button"
            onClick={() => navigate("/admin/agreements")}
          >
            <span className="nav-icon"><FiFileText /></span>
            <span className="nav-label">Agreements Management</span>
          </button>

          <button className="nav-item" type="button">
            <span className="nav-icon"><FiGlobe /></span>
            <span className="nav-label">Country Database</span>
          </button>

          {/* Product Library navigates to /admin/products */}
          <button
            className="nav-item"
            type="button"
            onClick={() => navigate("/admin/products")}
          >
            <span className="nav-icon">
              <FiBox />
            </span>
            <span className="nav-label">Product Library</span>
          </button>

          <button className="nav-item" type="button">
            <span className="nav-icon">
              <FiBarChart2 />
            </span>
            <span className="nav-label">Reports</span>
          </button>

          <button className="nav-item" type="button">
            <span className="nav-icon">
              <FiBell />
            </span>
            <span className="nav-label">News Feed Manager</span>
          </button>

          <button className="nav-item" type="button">
            <span className="nav-icon">
              <FiMessageSquare />
            </span>
            <span className="nav-label">Feedback Inbox</span>
          </button>

          <button
            className="nav-item logout"
            type="button"
            onClick={handleLogout}
          >
            <span className="nav-icon">
              <FiLogOut />
            </span>
            <span className="nav-label">Logout</span>
          </button>
        </nav>
      </aside>

      {/* Main content */}
      <main className="admin-main">
        {/* Top blue banner */}
        <section className="admin-hero">
          <div>
            <h1>Administrator Dashboard</h1>
            <p>Manage users, content, and system settings for TariffIntel.</p>
          </div>
        </section>

        {/* KPI row */}
        <section className="admin-kpi-row">
          <div className="admin-kpi-card">
            <div className="admin-kpi-label">Total Users</div>
            <div className="admin-kpi-value">
              {totalUsers.toLocaleString()}
            </div>
            <div className="admin-kpi-sub">+12% this month</div>
          </div>

          <div className="admin-kpi-card">
            <div className="admin-kpi-label">Active Sessions</div>
            <div className="admin-kpi-value">{activeSessions}</div>
            <div className="admin-kpi-sub">+5% from yesterday</div>
          </div>

          <div className="admin-kpi-card">
            <div className="admin-kpi-label">Total Queries</div>
            <div className="admin-kpi-value">
              {totalQueries.toLocaleString()}
            </div>
            <div className="admin-kpi-sub">This week</div>
          </div>

          <div className="admin-kpi-card">
            <div className="admin-kpi-label">System Health</div>
            <div className="admin-kpi-value">{systemHealth}%</div>
            <div className="admin-kpi-sub">All systems operational</div>
          </div>
        </section>

        {/* Admin functions cards */}
        <section className="admin-section">
          <div className="admin-section-header">
            <h2>Admin Functions</h2>
          </div>

          <div className="admin-functions-grid">
            {/* CARD navigates to /admin/users */}
            <div
              className="admin-function-card"
              onClick={() => navigate("/admin/users")}
              style={{ cursor: "pointer" }}
            >
              <div className="admin-func-icon user">
                <span>👥</span>
              </div>
              <div className="admin-func-content">
                <h3>User Management</h3>
                <p>Manage user accounts, roles, and permissions.</p>
                <span className="admin-function-meta">127 users</span>
              </div>
            </div>

            <div className="admin-function-card"
              onClick={() => navigate("/admin/agreements")}
              style={{cursor: "pointer"}}
            >
              <div className="admin-func-icon agreements">
                <span>📄</span>
              </div>
              <div className="admin-func-content">
                <h3>Agreements Management</h3>
                <p>Update trade agreements and policy changes.</p>
                <span className="admin-function-meta">43 agreements</span>
              </div>
            </div>

            <div className="admin-function-card">
              <div className="admin-func-icon country">
                <span>🌍</span>
              </div>
              <div className="admin-func-content">
                <h3>Country Database</h3>
                <p>Manage country tariff rates and regulations.</p>
                <span className="admin-function-meta">195 countries</span>
              </div>
            </div>

            <div
              className="admin-function-card"
              onClick={() => navigate("/admin/products")}
              style={{ cursor: "pointer" }}
            >
              <div className="admin-func-icon product">
                <span>📦</span>
              </div>
              <div className="admin-func-content">
                <h3>Product Library</h3>
                <p>Maintain HS codes and product categories.</p>
                <span className="admin-function-meta">17,360 products</span>
              </div>
            </div>

            <div className="admin-function-card">
              <div className="admin-func-icon reports">
                <span>📊</span>
              </div>
              <div className="admin-func-content">
                <h3>Reports</h3>
                <p>Generate system reports and analytics.</p>
                <span className="admin-function-meta">234 reports</span>
              </div>
            </div>

            <div className="admin-function-card">
              <div className="admin-func-icon news">
                <span>📰</span>
              </div>
              <div className="admin-func-content">
                <h3>News Feed Manager</h3>
                <p>Manage news articles and updates.</p>
                <span className="admin-function-meta">156 articles</span>
              </div>
            </div>
          </div>
        </section>

        {/* System activity and Recent Activity ... (unchanged) */}
        {/* keep the rest of your existing code here */}
      </main>
    </div>
  );
}

export default AdminDashboardPage;
