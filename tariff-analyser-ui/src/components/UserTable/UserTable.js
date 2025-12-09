import React from "react";
import "./UserTable.css";
import { FaEdit, FaTrash } from "react-icons/fa";


function UserTable({ users, onEdit, onDelete }) {
  return (
    <table className="user-table">
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
        {users.map((u) => (
          <tr key={u.id}>
            <td>{u.name}</td>
            <td>{u.email}</td>
            <td>
              <span className={`badge-role ${u.role.toLowerCase()}`}>{u.role}</span>
            </td>
            <td>
              <span className={`badge-status ${u.status.toLowerCase()}`}>{u.status}</span>
            </td>
            <td>{u.lastLogin ? new Date(u.lastLogin).toLocaleString() : "-"}</td>
            <td>{u.joinDate}</td>
            <td>
  <button className="icon-btn" onClick={() => onEdit(u)} title="Edit">
    <FaEdit />
  </button>
  <button
    className="icon-btn icon-btn-danger"
    onClick={() => onDelete(u.id)}
    title="Delete"
  >
    <FaTrash />
  </button>
</td>

          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default UserTable;
