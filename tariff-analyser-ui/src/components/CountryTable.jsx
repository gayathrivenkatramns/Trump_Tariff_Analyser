// src/components/CountryTable.jsx
import { useEffect, useState } from "react";

function CountryTable() {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [region, setRegion] = useState("All");
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const [form, setForm] = useState({
    country_name: "",
    iso_code: "",
    currency: "",
    region: "",
    status: "General",
    eligibility_criteria: "",
  });

  // Fetch list from API
  const fetchCountries = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (region && region !== "All") params.append("region", region);
      if (search) params.append("search", search);

      const res = await fetch(`/api/countries?${params.toString()}`);
      if (!res.ok) {
        console.error("Failed to fetch countries", res.status);
        setCountries([]);
        return;
      }
      const data = await res.json();
      setCountries(Array.isArray(data) ? data : data.rows || []);
    } catch (err) {
      console.error("Error fetching countries", err);
      setCountries([]);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchCountries();
  }, [region, search]);

  // form helpers
  const resetForm = () => {
    setForm({
      country_name: "",
      iso_code: "",
      currency: "",
      region: "",
      status: "General",
      eligibility_criteria: "",
    });
  };

  const startAdd = () => {
    setEditingId(null);
    resetForm();
    setModalOpen(true);
  };

  const startEdit = (c) => {
    setEditingId(c.id);
    setForm({
      country_name: c.country_name || "",
      iso_code: c.iso_code || "",
      currency: c.currency || "",
      region: c.region || "",
      status: c.status || "General",
      eligibility_criteria: c.eligibility_criteria || "",
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingId(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const saveCountry = async () => {
    const method = editingId ? "PUT" : "POST";
    const url = editingId ? `/api/countries/${editingId}` : "/api/countries";

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    closeModal();
    await fetchCountries();
  };

  const deleteCountry = async (id) => {
    if (!window.confirm("Delete this country?")) return;
    await fetch(`/api/countries/${id}`, { method: "DELETE" });
    await fetchCountries();
  };

  return (
    <div className="page country-page">
      <h2 className="country-title">Country & Tariff Database</h2>

      {/* Filters bar */}
      <div className="country-toolbar">
        <input
          className="country-search"
          placeholder="Search by country, ISO, or currency"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="country-region"
          value={region}
          onChange={(e) => setRegion(e.target.value)}
        >
          <option value="All">All Regions</option>
          <option value="Africa">Africa</option>
          <option value="Asia">Asia</option>
          <option value="Europe">Europe</option>
          <option value="North America">North America</option>
          <option value="South America">South America</option>
          <option value="Oceania">Oceania</option>
        </select>

        <button className="primary-btn country-add-btn" onClick={startAdd}>
          + Add Country
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="country-table-wrapper">
          <table className="countries-table">
            <thead>
              <tr>
                <th>Country Name</th>
                <th>ISO Code</th>
                <th>Currency</th>
                <th>Region</th>
                <th>Status</th>
                <th>Eligibility Criteria</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(countries) &&
                countries.map((c) => (
                  <tr key={c.id}>
                    <td>{c.country_name}</td>
                    <td>{c.iso_code}</td>
                    <td>{c.currency}</td>
                    <td>{c.region}</td>
                    <td>{c.status}</td>
                    <td>{c.eligibility_criteria}</td>
                    <td>
                      <button
                        className="icon-btn"
                        onClick={() => startEdit(c)}
                      >
                        ✏️
                      </button>
                      <button
                        className="icon-btn"
                        onClick={() => deleteCountry(c.id)}
                      >
                        🗑
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal for Add / Edit */}
      {modalOpen && (
        <div className="modal-backdrop">
          <div className="modal-panel country-modal">
            <div className="modal-header">
              <h3>{editingId ? "Edit Country" : "Add Country"}</h3>
              <button className="icon-btn" onClick={closeModal}>
                ✕
              </button>
            </div>

            <div className="modal-body country-modal-grid">
              <div className="form-field">
                <label>Country Name</label>
                <input
                  name="country_name"
                  value={form.country_name}
                  onChange={handleChange}
                />
              </div>

              <div className="form-field">
                <label>ISO Code</label>
                <input
                  name="iso_code"
                  value={form.iso_code}
                  onChange={handleChange}
                />
              </div>

              <div className="form-field">
                <label>Currency</label>
                <input
                  name="currency"
                  value={form.currency}
                  onChange={handleChange}
                />
              </div>

              <div className="form-field">
                <label>Region</label>
                <input
                  name="region"
                  value={form.region}
                  onChange={handleChange}
                />
              </div>

              <div className="form-field">
                <label>Status</label>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                >
                  <option value="General">General</option>
                  <option value="Special">Special</option>
                  <option value="Column2">Column2</option>
                </select>
              </div>

              <div className="form-field">
                <label>Eligibility Criteria</label>
                <input
                  name="eligibility_criteria"
                  placeholder="FTA / GSP / IL..."
                  value={form.eligibility_criteria}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="modal-footer">
              <button className="secondary-btn" onClick={closeModal}>
                Cancel
              </button>
              <button className="primary-btn" onClick={saveCountry}>
                {editingId ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CountryTable;