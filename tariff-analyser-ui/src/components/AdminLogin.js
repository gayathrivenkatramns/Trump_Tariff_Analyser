import React, { useState } from 'react';
import API from '../Api';

const AdminLogin = () => {
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/admin/login', {
        companyName,
        email,
        password,
      });
      localStorage.setItem('adminToken', res.data.token);
      alert('Admin logged in');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <label>Company Name</label>
      <input
        value={companyName}
        onChange={(e) => setCompanyName(e.target.value)}
        placeholder="Enter company name"
      />

      <label>Admin Email</label>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="admin@company.com"
      />

      <label>Password</label>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />

      {error && <p className="error">{error}</p>}

      <button className="primary-btn" type="submit">
        Login as Admin
      </button>
    </form>
  );
};

export default AdminLogin;
