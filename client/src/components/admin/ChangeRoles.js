import React, { useEffect, useState } from "react";
import { Container, Card, Form, Button, Toast, ToastContainer } from "react-bootstrap";
import { Link } from "react-router-dom";

function ChangeRoles() {
  // All state variables.
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [toast, setToast] = useState({ show: false, message: "", bg: "" });

  // Loads users.
  useEffect(() => {
    async function loadUsers() {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("/api/admin/users", { headers: { Authorization: `Bearer ${token}` } });
        const data = await res.json();

        if (!res.ok) throw new Error(data.message || "Failed to load users.");
        setUsers(data);
      } catch (err) {
        console.log("Error: ", err);
        setToast({ show: true, message: err.message || "Error loading users.", bg: "danger" });
      }
    }
    loadUsers();
  }, []);

  async function handleChangeRole(e) {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/admin/changeRole", {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ userId: selectedUser, newRole: selectedRole }),
      });
      const data = await res.json();
      if (!res.ok) {
        setToast({ show: true, message: data.message || "Role change failed.", bg: "danger" });
      } else {
        setToast({ show: true, message: "Role updated.", bg: "success" });
      }
    } catch (err) {
      console.log("Error: ", err);
      setToast({ show: true, message: "Server error.", bg: "danger" });
    }
  }

  const role = (
    <Container className="mt-4">
      <h2 className="text-white mb-4">Change User Roles</h2>
      <Button as={Link} to="/admin" variant="secondary" className="mb-3">
        ← Back to Admin Dashboard
      </Button>

      <Card className="mb-4">
        <Card.Body>
          <Form onSubmit={handleChangeRole}>
            <Form.Group className="mb-3">
              <Form.Label>User</Form.Label>
              <Form.Select value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)} required>
                <option value="">Select user</option>
                {users.map((u) => (
                  <option key={u._id} value={u._id}>
                    {u.username} ({u.role})
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>New Role</Form.Label>
              <Form.Select value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)} required>
                <option value="">Select role</option>
                <option value="normal">normal</option>
                <option value="management">management</option>
                <option value="admin">admin</option>
              </Form.Select>
            </Form.Group>

            <Button type="submit" variant="primary" className="w-100">
              Change Role
            </Button>
          </Form>
        </Card.Body>
      </Card>

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
  return role;
}

export default ChangeRoles;
