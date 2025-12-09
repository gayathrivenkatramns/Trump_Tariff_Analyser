import React, { useState } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";

import AdminLogin from "./components/AdminLogin";
import UserLogin from "./components/UserLogin";
import Signup from "./components/Signup";
import UserDashboard from "./components/UserDashboard";
import AdminDashboardPage from "./components/AdminDashboardPage";
import ProductLibraryPage from "./components/ProductLibraryPage";
import UserManagementPage from "./pages/UserManagementPage";   // <-- NEW
import "./App.css";

function AuthShell() {
  const [mode, setMode] = useState("auth");       // 'auth' | 'signup'
  const [activeTab, setActiveTab] = useState("admin"); // 'admin' | 'user'
  const navigate = useNavigate();

  const handleSignupSuccess = (role) => {
    setMode("auth");
    setActiveTab(role === "admin" ? "admin" : "user");
  };

  const handleUserLoginSuccess = () => {
    navigate("/user");
  };

  const handleAdminLoginSuccess = () => {
    navigate("/admin");
  };

  return (
    <div className="app">
      <div className="card">
        <div className="logo">TI</div>
        <h2>{mode === "auth" ? "Welcome to TariffIntel" : "Create Account"}</h2>
        <p className="subtitle">
          {mode === "auth"
            ? "Smart Intelligence for Global Tariffs"
            : "Sign up for TariffIntel"}
        </p>

        {mode === "auth" && (
          <>
            <div className="tabs">
              <button
                className={activeTab === "admin" ? "tab active" : "tab"}
                onClick={() => setActiveTab("admin")}
              >
                Admin Login
              </button>
              <button
                className={activeTab === "user" ? "tab active" : "tab"}
                onClick={() => setActiveTab("user")}
              >
                User Login
              </button>
            </div>

            {activeTab === "admin" ? (
              <AdminLogin onLoginSuccess={handleAdminLoginSuccess} />
            ) : (
              <UserLogin onLoginSuccess={handleUserLoginSuccess} />
            )}

            <div className="footer-link">
              Don&apos;t have an account?{" "}
              <span onClick={() => setMode("signup")}>Sign Up</span>
            </div>
          </>
        )}

        {mode === "signup" && (
          <>
            <Signup onSignupSuccess={handleSignupSuccess} />
            <div className="footer-link">
              Already have an account?{" "}
              <span onClick={() => setMode("auth")}>Sign In</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* login + signup shell */}
        <Route path="/" element={<AuthShell />} />

        {/* user dashboard after login */}
        <Route path="/user" element={<UserDashboard />} />

        {/* admin dashboard after login */}
        <Route path="/admin" element={<AdminDashboardPage />} />

        {/* product library page (from admin) */}
        <Route path="/admin/products" element={<ProductLibraryPage />} />

        {/* user management page (from admin, e.g. navigate('/admin/users')) */}
        <Route path="/admin/users" element={<UserManagementPage />} />

        {/* fallback → auth */}
        <Route path="*" element={<AuthShell />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
