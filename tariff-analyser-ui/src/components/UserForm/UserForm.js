import React, { useState, useEffect } from "react";
import "./UserForm.css";

const emptyForm = {
  name: "",
  email: "",
  role: "User",
  status: "Active",
  lastLogin: "",
  joinDate: ""
};

function UserForm({ onSubmit, editingUser, onCancel }) {
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (editingUser) {
      setForm({
        ...editingUser,
        lastLogin: editingUser.lastLogin
          ? editingUser.lastLogin.substring(0, 16)
          : "",
        joinDate: editingUser.joinDate || ""
      });
    } else {
      setForm(emptyForm);
    }
  }, [editingUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form className="user-form" onSubmit={handleSubmit}>
      <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
      <input name="email" placeholder="Email" type="email" value={form.email} onChange={handleChange} required />
      <select name="role" value={form.role} onChange={handleChange}>
        <option value="Admin">Admin</option>
        <option value="User">User</option>
        <option value="Analyst">Analyst</option>
      </select>
      <select name="status" value={form.status} onChange={handleChange}>
        <option value="Active">Active</option>
        <option value="Inactive">Inactive</option>
      </select>
      <input name="lastLogin" type="datetime-local" value={form.lastLogin} onChange={handleChange} />
      <input name="joinDate" type="date" value={form.joinDate} onChange={handleChange} required />
      <button type="submit">{editingUser ? "Update" : "Add User"}</button>
      {editingUser && (
        <button type="button" onClick={onCancel}>
          Cancel
        </button>
      )}
    </form>
  );
}

export default UserForm;
