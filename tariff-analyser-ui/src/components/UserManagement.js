// src/components/UserManagement.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "../App.css";

const API_BASE = 'http://localhost:5000';

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    admins: 0,
    newThisMonth: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'User',
    status: 'Active',
  });

  // Load users on mount
  useEffect(() => {
    loadUsers();
  }, []);

  // Load all users
  const loadUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/api/admin/users`);
      console.log('Users from API:', res.data.users); // debug lastLogin values
      setUsers(res.data.users || []);
      setStats(
        res.data.stats || {
          totalUsers: 0,
          activeUsers: 0,
          admins: 0,
          newThisMonth: 0,
        }
      );
      setError('');
    } catch (err) {
      console.error(err);
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  // Open add modal
  const handleAddUser = () => {
    setModalMode('add');
    setSelectedUser(null);
    setFormData({
      name: '',
      email: '',
      password: '',
      role: 'User',
      status: 'Active',
    });
    setShowModal(true);
  };

  // Open edit modal
  const handleEditUser = (user) => {
    setModalMode('edit');
    setSelectedUser(user);
    setFormData({
      name: user.name || '',
      email: user.email || '',
      password: '',
      role: user.role || 'User',
      status: user.status || 'Active',
    });
    setShowModal(true);
  };

  // Handle form change
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Submit form (add or edit)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email) {
      setError('Name and email are required');
      return;
    }

    if (modalMode === 'add' && !formData.password) {
      setError('Password is required for new users');
      return;
    }

    try {
      setLoading(true);

      if (modalMode === 'add') {
        await axios.post(`${API_BASE}/api/admin/users`, formData);
        setError('');
      } else {
        const updateData = {
          name: formData.name,
          email: formData.email,
          role: formData.role,
          status: formData.status,
        };
        await axios.put(
          `${API_BASE}/api/admin/users/${selectedUser.id}`,
          updateData
        );
        setError('');
      }

      setShowModal(false);
      loadUsers();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Failed to save user');
    } finally {
      setLoading(false);
    }
  };

  // Delete user
  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        setLoading(true);
        await axios.delete(`${API_BASE}/api/admin/users/${userId}`);
        setError('');
        loadUsers();
      } catch (err) {
        console.error(err);
        setError('Failed to delete user');
      } finally {
        setLoading(false);
      }
    }
  };

  // Change user status
  const handleStatusChange = async (userId, newStatus) => {
    try {
      setLoading(true);
      await axios.patch(`${API_BASE}/api/admin/users/${userId}/status`, {
        status: newStatus,
      });
      setError('');
      loadUsers();
    } catch (err) {
      console.error(err);
      setError('Failed to update status');
    } finally {
      setLoading(false);
    }
  };

  // Filter users by search term (handle nulls safely)
  const filteredUsers = users.filter((user) => {
    const name = (user.name || '').toLowerCase();
    const email = (user.email || '').toLowerCase();
    const term = searchTerm.toLowerCase();
    return name.includes(term) || email.includes(term);
  });

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Format last login
  const formatLastLogin = (dateString) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return formatDate(dateString);
  };

  return (
    <div className="user-management">
      <header className="um-header">
        <h1>User Management</h1>
      </header>

      {error && <div className="um-error">{error}</div>}

      {/* Stats */}
      <section className="um-stats">
        <div className="stat-card">
          <label>Total Users</label>
          <span className="stat-value">{stats.totalUsers}</span>
        </div>
        <div className="stat-card">
          <label>Active Users</label>
          <span className="stat-value">{stats.activeUsers}</span>
        </div>
        <div className="stat-card">
          <label>Admins</label>
          <span className="stat-value">{stats.admins}</span>
        </div>
        <div className="stat-card">
          <label>New This Month</label>
          <span className="stat-value">{stats.newThisMonth}</span>
        </div>
      </section>

      {/* Search & Add */}
      <section className="um-toolbar">
        <input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="um-search"
        />
        <button onClick={handleAddUser} className="um-btn-add">
          + Add User
        </button>
      </section>

      {/* Users Table */}
      <section className="um-table-container">
        {loading ? (
          <p className="um-loading">Loading...</p>
        ) : filteredUsers.length === 0 ? (
          <p className="um-empty">No users found</p>
        ) : (
          <table className="um-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Last Login</th>
                <th>Join Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => {
                const safeName = user.name || 'Unknown';
                const safeRole = user.role || 'User';
                const safeStatus = user.status || 'Active';

                return (
                  <tr key={user.id}>
                    <td>
                      <div className="um-user-name">
                        <span className="um-avatar">
                          {safeName.charAt(0).toUpperCase()}
                        </span>
                        <span>{safeName}</span>
                      </div>
                    </td>
                    <td>{user.email || '-'}</td>
                    <td>
                      <span
                        className={`um-badge um-badge-${safeRole.toLowerCase()}`}
                      >
                        {safeRole}
                      </span>
                    </td>
                    <td>
                      <select
                        value={safeStatus}
                        onChange={(e) =>
                          handleStatusChange(user.id, e.target.value)
                        }
                        className={`um-status um-status-${safeStatus.toLowerCase()}`}
                      >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </td>
                    <td>{formatLastLogin(user.lastLogin)}</td>
                    <td>{formatDate(user.createdAt)}</td>
                    <td>
                      <div className="um-actions">
                        <button
                          onClick={() => handleEditUser(user)}
                          className="um-btn-small um-btn-edit"
                          title="Edit"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="um-btn-small um-btn-delete"
                          title="Delete"
                        >
                          ✕
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </section>

      {/* Modal */}
      {showModal && (
        <div className="um-modal-overlay">
          <div className="um-modal">
            <div className="um-modal-header">
              <h2>{modalMode === 'add' ? 'Add New User' : 'Edit User'}</h2>
              <button
                onClick={() => setShowModal(false)}
                className="um-modal-close"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="um-form">
              <div className="um-form-group">
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  required
                />
              </div>

              <div className="um-form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleFormChange}
                  required
                />
              </div>

              {modalMode === 'add' && (
                <div className="um-form-group">
                  <label>Password</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleFormChange}
                    required
                  />
                </div>
              )}

              <div className="um-form-row">
                <div className="um-form-group">
                  <label>Role</label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleFormChange}
                  >
                    <option value="User">User</option>
                    <option value="Analyst">Analyst</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>

                <div className="um-form-group">
                  <label>Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleFormChange}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="um-modal-footer">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="um-btn-cancel"
                >
                  Cancel
                </button>
                <button type="submit" className="um-btn-submit" disabled={loading}>
                  {loading ? 'Saving...' : 'Save User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserManagement;
