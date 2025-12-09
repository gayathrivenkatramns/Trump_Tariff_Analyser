// src/pages/UserManagementPage.js
import React, { useEffect, useState } from "react";
import UserForm from "../components/UserForm/UserForm";
import UserTable from "../components/UserTable/UserTable";
import { getUsers, createUser, updateUser, deleteUser } from "../api/usersApi";
import { FaUsers } from "react-icons/fa";
import { MdShield } from "react-icons/md";
import { RiUserSettingsFill } from "react-icons/ri";
import { FiPieChart, FiUsers, FiFileText, FiGlobe, FiBox, FiBarChart2, FiBell, FiMessageSquare, FiLogOut } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import "./UserManagementPage.css";

function UserManagementPage() {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navigate = useNavigate();

  const loadUsers = async () => {
    const res = await getUsers();
    setUsers(res.data);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/");
  };

  // CREATE
  const handleCreate = async (data) => {
    await createUser(data);
    await loadUsers();
  };

  // UPDATE
  const handleUpdate = async (data) => {
    if (!editingUser || !editingUser.id) return;
    await updateUser(editingUser.id, data);
    setEditingUser(null);
    await loadUsers();
  };

  // Decide create vs update
  const handleSubmit = async (data) => {
    if (editingUser && editingUser.id) {
      await handleUpdate(data);
    } else {
      await handleCreate(data);
    }
  };

  // DELETE
  const handleDelete = async (id) => {
    await deleteUser(id);
    await loadUsers();
  };

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  const totalUsers = users.length;
  const activeUsers = users.filter((u) => u.status === "Active").length;
  const admins = users.filter((u) => u.role === "Admin").length;
  const newThisMonth = users.filter((u) => {
    if (!u.joinDate) return false;
    const d = new Date(u.joinDate);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;

  return (
    <div className="admin-layout">
      {/* same sidebar as AdminDashboard, but User Management active */}
      <aside className="sidebar admin-sidebar">
        <div className="sidebar-header">
          <div className="sidebar-logo-circle">TI</div>
          <div className="sidebar-title">TariffIntel</div>
        </div>

        <nav className="sidebar-nav">
          <button
            className="nav-item"
            type="button"
            onClick={() => navigate("/admin")}
          >
            <span className="nav-icon">
              <FiPieChart />
            </span>
            <span className="nav-label">Admin Dashboard</span>
          </button>

          <button className="nav-item active" type="button">
            <span className="nav-icon">
              <FiUsers />
            </span>
            <span className="nav-label">User Management</span>
          </button>

          <button className="nav-item" type="button">
            <span className="nav-icon">
              <FiFileText />
            </span>
            <span className="nav-label">Agreements Management</span>
          </button>

          <button className="nav-item" type="button">
            <span className="nav-icon">
              <FiGlobe />
            </span>
            <span className="nav-label">Country Database</span>
          </button>

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

      {/* User Management main area */}
      <main className="admin-main">
        <header className="topbar">
          <h1>User Management</h1>
        </header>

        {/* Summary cards with icons */}
        <section className="cards-row">
          <div className="stat-card">
            <div className="stat-card-header">
              <span className="stat-label">Total Users</span>
              <span className="stat-icon stat-icon-blue">
                <FaUsers />
              </span>
            </div>
            <span className="stat-value">{totalUsers}</span>
          </div>

          <div className="stat-card">
            <div className="stat-card-header">
              <span className="stat-label">Active Users</span>
              <span className="stat-icon stat-icon-green">
                <FaUsers />
              </span>
            </div>
            <span className="stat-value">{activeUsers}</span>
          </div>

          <div className="stat-card">
            <div className="stat-card-header">
              <span className="stat-label">Admins</span>
              <span className="stat-icon stat-icon-purple">
                <RiUserSettingsFill />
              </span>
            </div>
            <span className="stat-value">{admins}</span>
          </div>

          <div className="stat-card">
            <div className="stat-card-header">
              <span className="stat-label">New This Month</span>
              <span className="stat-icon stat-icon-green">
                <MdShield />
              </span>
            </div>
            <span className="stat-value">{newThisMonth}</span>
          </div>
        </section>

        <section className="content-card">
          <div className="content-header">
            <h2>All Users</h2>
            <div className="content-tools">
              <input
                className="search-input"
                placeholder="Search users..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button
                className="primary-btn"
                onClick={() => {
                  setEditingUser(null);
                  setIsModalOpen(true);
                }}
              >
                Add User
              </button>
            </div>
          </div>

          <UserTable
            users={filtered}
            onEdit={(u) => {
              setEditingUser(u);
              setIsModalOpen(true);
            }}
            onDelete={handleDelete}
          />
        </section>

        {isModalOpen && (
          <div className="modal-backdrop">
            <div className="modal">
              <div className="modal-header">
                <h3>{editingUser ? "Edit User" : "Add New User"}</h3>
                <button
                  className="modal-close"
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingUser(null);
                  }}
                >
                  ×
                </button>
              </div>

              <UserForm
                onSubmit={async (data) => {
                  await handleSubmit(data);
                  setIsModalOpen(false);
                }}
                editingUser={editingUser}
                onCancel={() => {
                  setIsModalOpen(false);
                  setEditingUser(null);
                }}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default UserManagementPage;
