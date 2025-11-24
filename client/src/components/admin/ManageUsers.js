import React, { useEffect, useState } from "react";
import { Container, Table, Button, Toast, ToastContainer } from "react-bootstrap";
import { Link } from "react-router-dom";

function ManageUsers() {
  // All state variables.
  const [users, setUsers] = useState([]);
  const [toast, setToast] = useState({ show: false, message: "", bg: "" });

  // load users
  useEffect(() => {
    async function load() {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("/api/admin/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) {
          setToast({ show: true, message: data.message || "Failed to load users.", bg: "danger" });
        } else {
          setUsers(data);
        }
      } catch (err) {
        console.log("Error: ", err);
        setToast({ show: true, message: "Server error.", bg: "danger" });
      }
    }
    load();
  }, []);

  const manage =  (
    <Container className="mt-4">
      <h2 className="text-white mb-4">Manage Users</h2>
      <Button as={Link} to="/admin" variant="secondary" className="mb-3">
        ← Back to Admin Dashboard
      </Button>

      <Table striped bordered hover variant="dark">
        <thead>
          <tr>
            <th>Username</th>
            <th>Role</th>
            <th>Divisions</th>
            <th>Organisational Units</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u._id}>
              <td>{u.username}</td>
              <td>{u.role}</td>
              <td>{u.divisions && u.divisions.length > 0 ? u.divisions.map((d) => d.name || d).join(", ") : "—"}</td>
              <td>{u.organisationalUnits && u.organisationalUnits.length > 0 ? u.organisationalUnits.map((o) => o.name || o).join(", ") : "—"}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      <ToastContainer position="top-end" className="p-3">
        <Toast bg={toast.bg} show={toast.show} autohide delay={3000} onClose={() => setToast({ ...toast, show: false })}>
          <Toast.Header closeButton>
            <strong className="me-auto">Admin</strong>
          </Toast.Header>
          <Toast.Body className="text-white">{toast.message}</Toast.Body>
        </Toast>
      </ToastContainer>
    </Container>
  );
  return manage;
}

export default ManageUsers;
