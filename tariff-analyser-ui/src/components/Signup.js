import React, { useState } from 'react';
import API from '../api';

const Signup = ({ onSignupSuccess }) => {
  const [name, setName] = useState('');        // NEW
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('user');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // send name so it is stored in Users table
      const res = await API.post('/auth/signup', { name, email, password, role });
      if (onSignupSuccess) onSignupSuccess(res.data.role);
    } catch (err) {
      setError(err.response?.data?.error || 'Signup failed');
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <label>Name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Your name"
      />

      <label>Email</label>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
      />

      <label>Role</label>
      <select
        className="input"
        value={role}
        onChange={(e) => setRole(e.target.value)}
      >
        <option value="admin">Admin</option>
        <option value="analyst">Analyst</option>
        <option value="user">User</option>
      </select>

      <label>Password</label>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />

      {error && <p className="error">{error}</p>}

      <button className="primary-btn" type="submit">
        Sign Up
      </button>
    </form>
  );
};

export default Signup;
