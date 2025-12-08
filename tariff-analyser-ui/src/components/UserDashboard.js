import React, { useState } from 'react';
import {
  FiHome,
  FiLayers,
  FiBarChart2,
  FiDollarSign,
  FiGlobe,
  FiDatabase,
  FiSettings,
  FiLogOut,
  FiFileText,
  FiTrendingUp,
} from 'react-icons/fi';

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: <FiHome /> },
  { id: 'industry', label: 'Industry Explorer', icon: <FiLayers /> },
  { id: 'tariff', label: 'Tariff Impact Analysis', icon: <FiBarChart2 /> },
  { id: 'taxation', label: 'Taxation Module', icon: <FiFileText /> },
  { id: 'trade', label: 'Trade Comparison', icon: <FiTrendingUp /> },
  { id: 'forex', label: 'Forex Analysis', icon: <FiDollarSign /> },
  { id: 'cost', label: 'Cost Calculator', icon: <FiGlobe /> },
  { id: 'data', label: 'Data Manager', icon: <FiDatabase /> },
  { id: 'news', label: 'News', icon: <FiBarChart2 /> },
  { id: 'settings', label: 'Settings', icon: <FiSettings /> },
];

const UserDashboard = () => {
  const [active, setActive] = useState('dashboard');

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    window.location.reload();
  };

  const renderContent = () => {
    switch (active) {
      case 'industry':
        return <h2>Industry Explorer</h2>;
      case 'tariff':
        return <h2>Tariff Impact Analysis</h2>;
      case 'taxation':
        return <h2>Taxation Module</h2>;
      case 'trade':
        return <h2>Trade Comparison</h2>;
      case 'forex':
        return <h2>Forex Analysis</h2>;
      case 'cost':
        return <h2>Cost Calculator</h2>;
      case 'data':
        return <h2>Data Manager</h2>;
      case 'news':
        return <h2>News</h2>;
      case 'settings':
        return <h2>Settings</h2>;
      default:
        return (
          <>
            <div className="welcome-banner">
              <h2>Welcome to TariffIntel</h2>
              <p>
                Comprehensive analysis tools for understanding global tariff
                impacts and trade dynamics.
              </p>
            </div>
            {/* Quick actions + cards can be added here */}
          </>
        );
    }
  };

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="sidebar-logo">TI</div>
          <span>TariffIntel</span>
        </div>

        <nav className="sidebar-menu">
          {menuItems.map((item) => (
            <button
              key={item.id}
              className={
                active === item.id ? 'sidebar-item active' : 'sidebar-item'
              }
              onClick={() => setActive(item.id)}
            >
              <span className="icon">{item.icon}</span>
              <span className="label">{item.label}</span>
            </button>
          ))}
        </nav>

        <button className="sidebar-logout" onClick={handleLogout}>
          <FiLogOut className="icon" />
          <span className="label">Logout</span>
        </button>
      </aside>

      <main className="main">
        <header className="main-header">
          <h1>Trump Tariff Impact Analysis</h1>
          {/* add right-side controls if needed */}
        </header>

        <section className="main-content">{renderContent()}</section>
      </main>
    </div>
  );
};

export default UserDashboard;
