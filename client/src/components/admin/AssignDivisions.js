import React, { useEffect, useState } from "react";
import { Container, Card, Form, Button, Toast, ToastContainer } from "react-bootstrap";
import { Link } from "react-router-dom";

function AssignDivisions() {
  // All state variables.
  const [users, setUsers] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedDivision, setSelectedDivision] = useState("");
  const [toast, setToast] = useState({ show: false, message: "", bg: "" });

  // load users and divisions
  useEffect(() => {
    async function load() {
      try {
        const token = localStorage.getItem("token");
        const userRes = await fetch("/api/admin/users", { headers: { Authorization: `Bearer ${token}` } });
        const userData = await userRes.json();

        if (!userRes.ok) throw new Error(userData.message || "Failed to load users.");
        setUsers(userData);

        const divRes = await fetch("/api/divisions", { headers: { Authorization: `Bearer ${token}` } });
        const divData = await divRes.json();

        if (!divRes.ok) throw new Error(divData.message || "Failed to load divisions.");
        setDivisions(divData);
      } catch (err) {
        console.log("Error: ", err);
        setToast({ show: true, message: err.message || "Error loading data.", bg: "danger" });
      }
    }
    load();
  }, []);

  // assign division
  async function handleAssign(e) {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/admin/assignDivision", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ userId: selectedUser, divisionId: selectedDivision }),
      });
      const data = await res.json();

      if (!res.ok) {
        setToast({ show: true, message: data.message || "Assign failed.", bg: "danger" });
      } else {
        setToast({ show: true, message: "Assigned successfully.", bg: "success" });
      }
    } catch (err) {
      console.log("Error: ", err);
      setToast({ show: true, message: "Server error.", bg: "danger" });
    }
  }

  // unassign division
  async function handleUnassign(e) {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/admin/unassignDivision", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ userId: selectedUser, divisionId: selectedDivision }),
      });
      const data = await res.json();

      if (!res.ok) {
        setToast({ show: true, message: data.message || "Unassign failed.", bg: "danger" });
      } else {
        setToast({ show: true, message: "Removed successfully.", bg: "success" });
      }
    } catch (err) {
      console.log("Error: ", err);
      setToast({ show: true, message: "Server error.", bg: "danger" });
    }
  }

  const assignDiv = (
    <Container className="mt-4">
      <h2 className="text-white mb-4">Assign / Unassign Divisions</h2>
      <Button as={Link} to="/admin" variant="secondary" className="mb-3">
        ← Back to Admin Dashboard
      </Button>

      <Card className="mb-4">
        <Card.Body>
          <Form onSubmit={handleAssign}>
            <Form.Group className="mb-3">
              <Form.Label>User</Form.Label>
              <Form.Select value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)} required>
                <option value="">Select user</option>
                {users.map((u) => (
                  <option key={u._id} value={u._id}>
                    {u.username}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Division</Form.Label>
              <Form.Select value={selectedDivision} onChange={(e) => setSelectedDivision(e.target.value)} required>
                <option value="">Select division</option>
                {divisions.map((d) => (
                  <option key={d._id} value={d._id}>
                    {d.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <div className="d-flex gap-2">
              <Button type="submit" variant="success">
                Assign
              </Button>
              <Button variant="danger" onClick={handleUnassign}>
                Unassign
              </Button>
            </div>
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
  return assignDiv;
}

export default AssignDivisions;
