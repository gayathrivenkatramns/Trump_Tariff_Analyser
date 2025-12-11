// src/components/ProductLibraryPage.js
import React, { useEffect, useState } from "react";
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

const API_BASE = "http://localhost:5000/api";

function ProductLibraryPage() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  const [form, setForm] = useState({
    id: null,
    hts_code: "",
    product: "",
    general_rate_of_duty: "",
    special_rate_of_duty: "",
    column2_rate_of_duty: "",
  });

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/");
  };

  const loadProducts = async (searchText = "") => {
    setLoading(true);
    try {
      const params = searchText
        ? `?search=${encodeURIComponent(searchText)}`
        : "";
      const res = await fetch(`${API_BASE}/products${params}`);
      const data = await res.json();

      const rows = Array.isArray(data) ? data : data.data || [];
      setProducts(rows);

      const count = Array.isArray(data) ? rows.length : data.total || rows.length;
      setTotal(count);
    } catch (e) {
      console.error(e);
      alert("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadProducts(search.trim());
  };

  const openCreate = () => {
    setForm({
      id: null,
      hts_code: "",
      product: "",
      general_rate_of_duty: "",
      special_rate_of_duty: "",
      column2_rate_of_duty: "",
    });
    setIsFormOpen(true);
  };

  const openEdit = (p) => {
    setForm({
      id: p.id,
      hts_code: p.hts_code,
      product: p.product,
      general_rate_of_duty: p.general_rate_of_duty,
      special_rate_of_duty: p.special_rate_of_duty,
      column2_rate_of_duty: p.column2_rate_of_duty,
    });
    setIsFormOpen(true);
  };

  const closeForm = () => setIsFormOpen(false);

  const openDeleteConfirm = (p) => {
    setProductToDelete(p);
    setIsDeleteOpen(true);
  };

  const closeDeleteConfirm = () => {
    setIsDeleteOpen(false);
    setProductToDelete(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      hts_code: form.hts_code,
      product: form.product,
      general_rate_of_duty: form.general_rate_of_duty,
      special_rate_of_duty: form.special_rate_of_duty,
      column2_rate_of_duty: form.column2_rate_of_duty,
    };

    const isEdit = !!form.id;
    const url = isEdit
      ? `${API_BASE}/products/${form.id}`
      : `${API_BASE}/products`;
    const method = isEdit ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Save failed");
      await loadProducts(search.trim());
      closeForm();
    } catch (e) {
      console.error(e);
      alert(e.message);
    }
  };

  const handleConfirmDelete = async () => {
    if (!productToDelete) return;
    try {
      const res = await fetch(`${API_BASE}/products/${productToDelete.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Delete failed");
      await loadProducts(search.trim());
      closeDeleteConfirm();
    } catch (e) {
      console.error(e);
      alert(e.message);
    }
  };

  return (
     <div className="admin-layout">
          {/* Sidebar – copied from AdminDashboardPage, with Agreements active */}
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
    
              <button className="nav-item" type="button">
                <span className="nav-icon">
                  <FiUsers />
                </span>
                <span className="nav-label">User Management</span>
              </button>
    
              <button
                className="nav-item"
                type="button"
              >
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
                className="nav-item active"
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
        <div className="admin-main-inner">
          {/* Hero */}
          <section className="admin-hero">
            <div>
              <h1>Product &amp; HTS Code Library</h1>
              <p>Browse, add, and manage tariff products and HS codes.</p>
            </div>
          </section>

          {/* Card with search + table */}
          <section className="card">
            <div className="card-toolbar">
              <form className="card-search-group" onSubmit={handleSearchSubmit}>
                <input
                  className="input"
                  type="text"
                  placeholder="Search by product name or HS code..."
                  value={search}
                  onChange={handleSearchChange}
                />
                <button className="primary-button small" type="submit">
                  Search
                </button>
              </form>

              <div className="card-right-group">
                <button
                  className="primary-button"
                  type="button"
                  onClick={openCreate}
                >
                  + Add Product
                </button>
                <span className="card-total-pill">Total: {total} products</span>
              </div>
            </div>

            {loading ? (
              <p>Loading...</p>
            ) : (
              <div className="table-wrapper">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Product Name</th>
                      <th>HS Code</th>
                      <th>General Rate</th>
                      <th>Special Rate</th>
                      <th>Column 2 Rate</th>
                      <th style={{ width: 120 }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((p) => (
                      <tr key={p.id}>
                        <td>{p.product}</td>
                        <td className="tag tag-soft">{p.hts_code}</td>
                        <td>{p.general_rate_of_duty || "—"}</td>
                        <td>{p.special_rate_of_duty || "—"}</td>
                        <td>{p.column2_rate_of_duty || "—"}</td>
                        <td>
                          <button
                            className="icon-button edit-icon"
                            type="button"
                            onClick={() => openEdit(p)}
                            aria-label="Edit product"
                          >
                            ✏️
                          </button>
                          <button
                            className="icon-button delete-icon"
                            type="button"
                            onClick={() => openDeleteConfirm(p)}
                            aria-label="Delete product"
                          >
                            🗑
                          </button>
                        </td>
                      </tr>
                    ))}
                    {products.length === 0 && !loading && (
                      <tr>
                        <td colSpan={6} className="empty-row">
                          No products match this search.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>

        {/* Add/Edit modal */}
        {isFormOpen && (
          <div className="side-modal-backdrop" onClick={closeForm}>
            <div
              className="side-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <header className="side-modal-header">
                <h2>{form.id ? "Edit Product" : "Add New Product"}</h2>
                <button
                  className="icon-button"
                  type="button"
                  onClick={closeForm}
                >
                  ✕
                </button>
              </header>

              <form className="side-modal-body" onSubmit={handleSubmit}>
                <div className="field-row">
                  <label className="field">
                    <span className="field-label">Product Name *</span>
                    <input
                      name="product"
                      value={form.product}
                      onChange={handleChange}
                      placeholder="Enter product name"
                      required
                    />
                  </label>

                  <label className="field">
                    <span className="field-label">HS Code *</span>
                    <input
                      name="hts_code"
                      value={form.hts_code}
                      onChange={handleChange}
                      placeholder="e.g., 8517.12"
                      required
                    />
                  </label>
                </div>

                <div className="field">
                  <span className="field-label">Duty Rates (%)</span>
                  <div className="duty-grid">
                    <div>
                      <span className="field-label">General</span>
                      <input
                        name="general_rate_of_duty"
                        value={form.general_rate_of_duty}
                        onChange={handleChange}
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <span className="field-label">Special</span>
                      <input
                        name="special_rate_of_duty"
                        value={form.special_rate_of_duty}
                        onChange={handleChange}
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <span className="field-label">Column 2</span>
                      <input
                        name="column2_rate_of_duty"
                        value={form.column2_rate_of_duty}
                        onChange={handleChange}
                        placeholder="0"
                      />
                    </div>
                  </div>
                </div>

                <div className="side-modal-footer">
                  <button
                    type="button"
                    className="ghost-button"
                    onClick={closeForm}
                  >
                    Cancel
                  </button>
                  <button className="primary-button" type="submit">
                    {form.id ? "Save Changes" : "Create Product"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete confirmation modal */}
        {isDeleteOpen && (
          <div
            className="confirm-backdrop"
            onClick={closeDeleteConfirm}
          >
            <div
              className="confirm-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <h3>Delete Product</h3>
              <p>
                Are you sure you want to delete this product from the library?
                This action cannot be undone.
              </p>
              <div className="confirm-actions">
                <button
                  type="button"
                  className="ghost-button"
                  onClick={closeDeleteConfirm}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="primary-button danger"
                  onClick={handleConfirmDelete}
                >
                  Delete Product
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default ProductLibraryPage;
