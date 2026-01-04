// src/components/AdminDashboardPage.js
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import {
  FiPieChart,
  FiUsers,
  FiFileText,
  FiGlobe,
  FiBox,
  FiBarChart2,
  FiMessageSquare,
  FiLogOut,
} from "react-icons/fi";
import UserManagement from "./UserManagement";
import CountryTable from "./CountryTable"; // use this
import "../App.css";

function AdminDashboardPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // Read optional state from navigate("/admin", { state: { page: "users" } })
  const [currentPage, setCurrentPage] = useState(
    location.state?.page || "dashboard"
  );

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/"); // back to login shell
  };

  // Mock numbers – later replace with real API data
  const totalUsers = 1247;
  const activeSessions = 178;
  const totalQueries = 45892;
  const systemHealth = 98.2;

  // Sidebar menu items (News removed)
  const menuItems = [
    { id: "dashboard", label: "Admin Dashboard", icon: <FiPieChart /> },
    { id: "users", label: "User Management", icon: <FiUsers /> },
    { id: "agreements", label: "Agreements Management", icon: <FiFileText /> },
    { id: "countries", label: "Country Database", icon: <FiGlobe /> },
    { id: "products", label: "Product Library", icon: <FiBox /> },
    { id: "reports", label: "Reports", icon: <FiBarChart2 /> },
    { id: "feedback", label: "Feedback Inbox", icon: <FiMessageSquare /> },
  ];

  // Decide whether to navigate to a route or switch internal tab
  const handleMenuClick = (itemId) => {
    if (itemId === "products") {
      navigate("/admin/products"); // ProductLibraryPage
      return;
    }
    if (itemId === "agreements") {
      navigate("/admin/agreements"); // AgreementManagementPage
      return;
    }
    // Internal pages that stay under /admin
    setCurrentPage(itemId);
  };

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="sidebar admin-sidebar">
        <div className="sidebar-header">
          <div className="sidebar-logo-circle">TI</div>
          <div className="sidebar-title">TariffIntel</div>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`nav-item ${
                currentPage === item.id ? "active" : ""
              }`}
              onClick={() => handleMenuClick(item.id)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </button>
          ))}

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

      {/* Main content (for /admin internal views) */}
      <main className="admin-main">
        {/* User Management full page */}
        {currentPage === "users" && <UserManagement />}

        {/* Dashboard Page */}
        {currentPage === "dashboard" && (
          <>
            {/* Top blue banner */}
            <section className="admin-hero">
              <div>
                <h1>Administrator Dashboard</h1>
                <p>
                  Manage users, content, and system settings for TariffIntel.
                </p>
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
                {/* User Management card */}
                <div
                  className="admin-function-card"
                  onClick={() => setCurrentPage("users")}
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

                {/* Agreements Management card */}
                <div
                  className="admin-function-card"
                  onClick={() => navigate("/admin/agreements")}
                  style={{ cursor: "pointer" }}
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

                {/* Country Database card */}
                <div
                  className="admin-function-card"
                  onClick={() => setCurrentPage("countries")}
                  style={{ cursor: "pointer" }}
                >
                  <div className="admin-func-icon country">
                    <span>🌍</span>
                  </div>
                  <div className="admin-func-content">
                    <h3>Country Database</h3>
                    <p>Manage country tariff rates and regulations.</p>
                    <span className="admin-function-meta">195 countries</span>
                  </div>
                </div>

                {/* Product Library card */}
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
                    <span className="admin-function-meta">8,429 products</span>
                  </div>
                </div>

                {/* Reports card */}
                <div
                  className="admin-function-card"
                  onClick={() => setCurrentPage("reports")}
                  style={{ cursor: "pointer" }}
                >
                  <div className="admin-func-icon reports">
                    <span>📊</span>
                  </div>
                  <div className="admin-func-content">
                    <h3>Reports</h3>
                    <p>Generate system reports and analytics.</p>
                    <span className="admin-function-meta">234 reports</span>
                  </div>
                </div>
              </div>
            </section>

            {/* System activity (Last 7 Days) */}
            <section className="admin-panel">
              <div className="panel-header">
                <h3>System Activity (Last 7 Days)</h3>
              </div>
              <div className="admin-chart-placeholder">
                <div className="admin-chart-line" />
                <div className="admin-chart-axis-labels">
                  <span>Nov 20</span>
                  <span>Nov 21</span>
                  <span>Nov 22</span>
                  <span>Nov 23</span>
                  <span>Nov 24</span>
                  <span>Nov 25</span>
                  <span>Nov 26</span>
                </div>
              </div>
            </section>

            {/* Recent Activity */}
            <section className="admin-panel admin-recent-panel">
              <div className="panel-header">
                <h3>Recent Activity</h3>
              </div>
              <ul className="admin-activity-list">
                <li className="admin-activity-item">
                  <span className="admin-activity-icon user">👤</span>
                  <div className="admin-activity-main">
                    <div className="admin-activity-title">
                      New user registered: john@example.com
                    </div>
                    <div className="admin-activity-time">5 minutes ago</div>
                  </div>
                </li>

                <li className="admin-activity-item">
                  <span className="admin-activity-icon green">🔄</span>
                  <div className="admin-activity-main">
                    <div className="admin-activity-title">
                      Tariff rate updated for China - Electronics
                    </div>
                    <div className="admin-activity-time">23 minutes ago</div>
                  </div>
                </li>

                <li className="admin-activity-item">
                  <span className="admin-activity-icon purple">📃</span>
                  <div className="admin-activity-main">
                    <div className="admin-activity-title">
                      New trade agreement added: US–India
                    </div>
                    <div className="admin-activity-time">1 hour ago</div>
                  </div>
                </li>

                <li className="admin-activity-item">
                  <span className="admin-activity-icon orange">📰</span>
                  <div className="admin-activity-main">
                    <div className="admin-activity-title">
                      News article published: Steel Tariff Changes
                    </div>
                    <div className="admin-activity-time">2 hours ago</div>
                  </div>
                </li>

                <li className="admin-activity-item">
                  <span className="admin-activity-icon gray">💾</span>
                  <div className="admin-activity-main">
                    <div className="admin-activity-title">
                      System backup completed successfully
                    </div>
                    <div className="admin-activity-time">4 hours ago</div>
                  </div>
                </li>
              </ul>
            </section>
          </>
        )}

        {/* Country Database full page */}
        {currentPage === "countries" && <CountryTable />}

        {/* Placeholder Pages for other internal tabs */}
        {currentPage === "reports" && (
          <section className="admin-hero">
            <h1>Reports</h1>
            <p>Coming soon...</p>
          </section>
        )}

        {currentPage === "feedback" && (
          <section className="admin-hero">
            <h1>Feedback Inbox</h1>
            <p>Coming soon...</p>
          </section>
        )}
      </main>
    </div>
  );
}

export default AdminDashboardPage;
