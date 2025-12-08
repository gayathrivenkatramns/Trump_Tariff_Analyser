import React, { useState } from 'react';
import AdminLogin from './components/AdminLogin';
import UserLogin from './components/UserLogin';
import Signup from './components/Signup';
import UserDashboard from './components/UserDashboard';
import './App.css';

function App() {
  const [mode, setMode] = useState('auth'); // 'auth' | 'dashboard'
  const [activeTab, setActiveTab] = useState('admin'); // 'admin' | 'user'

  const handleSignupSuccess = (role) => {
    // go back to login and select tab based on role
    setMode('auth');
    setActiveTab(role === 'admin' ? 'admin' : 'user');
  };

  const handleUserLoginSuccess = () => {
    setMode('dashboard');
  };

  if (mode === 'dashboard') {
    return <UserDashboard />;
  }

  return (
    <div className="app">
      <div className="card">
        <div className="logo">TI</div>
        <h2>{mode === 'auth' ? 'Welcome to TariffIntel' : 'Create Account'}</h2>
        <p className="subtitle">
          {mode === 'auth'
            ? 'Smart Intelligence for Global Tariffs'
            : 'Sign up for TariffIntel'}
        </p>

        {mode === 'auth' && (
          <>
            <div className="tabs">
              <button
                className={activeTab === 'admin' ? 'tab active' : 'tab'}
                onClick={() => setActiveTab('admin')}
              >
                Admin Login
              </button>
              <button
                className={activeTab === 'user' ? 'tab active' : 'tab'}
                onClick={() => setActiveTab('user')}
              >
                User Login
              </button>
            </div>

            {activeTab === 'admin' ? (
              <AdminLogin />
            ) : (
              <UserLogin onLoginSuccess={handleUserLoginSuccess} />
            )}

            <div className="footer-link">
              Don&apos;t have an account?{' '}
              <span onClick={() => setMode('signup')}>Sign Up</span>
            </div>
          </>
        )}

        {mode === 'signup' && (
          <>
            <Signup onSignupSuccess={handleSignupSuccess} />
            <div className="footer-link">
              Already have an account?{' '}
              <span onClick={() => setMode('auth')}>Sign In</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
