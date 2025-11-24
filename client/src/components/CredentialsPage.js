import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Container, Card, Row, Col, Button, Form, Toast, ToastContainer } from "react-bootstrap";

function CredentialsPage() {
  // Get division ID from the URL
  const { divisionId } = useParams();

  // Store the list of credentials
  const [credentials, setCredentials] = useState([]);

  // Add form fields
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [notes, setNotes] = useState("");

  // Edit form fields
  const [editId, setEditId] = useState("");
  const [editName, setEditName] = useState("");
  const [editUsername, setEditUsername] = useState("");
  const [editPassword, setEditPassword] = useState("");
  const [editNotes, setEditNotes] = useState("");
  // Toast messages
  const [toast, setToast] = useState({ show: false, message: "", bg: "" });
  const user = JSON.parse(localStorage.getItem("user"));
  // Load credentials when the page opens.
  useEffect(() => {
    async function fetchCredentials() {
      const token = localStorage.getItem("token");

      const res = await fetch(`/api/credentials/${divisionId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        setToast({ show: true, message: data.message, bg: "danger" });
      } else {
        setCredentials(data);
      }
    }

    fetchCredentials();
  });

  // Add a credential
  async function handleAddCredential(e) {
    e.preventDefault();

    const token = localStorage.getItem("token");

    const res = await fetch("/api/credentials", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        divisionId,
        name,
        username,
        password,
        notes,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      return setToast({
        show: true,
        message: data.message,
        bg: "danger",
      });
    }

    setToast({ show: true, message: "Credential added!", bg: "success" });

    // Reset form
    setName("");
    setUsername("");
    setPassword("");
    setNotes("");

    // Refresh list
    reloadCredentials();
  }

  // Load a credential into edit form
  function beginEdit(cred) {
    // Ensure credential is valid
    if (!cred || !cred._id) {
      return setToast({ show: true, message: "Invalid credential", bg: "danger" });
    }

    // Store the whole object to prevent render issues.
    setEditId(cred._id);
    setEditName(cred.name ?? "");
    setEditUsername(cred.username ?? "");
    setEditPassword(cred.password ?? "");
    setEditNotes(cred.notes ?? "");

    // scroll into view so user sees the form immediately.
    setTimeout(() => {
      const element = document.getElementById("edit-form");
      if (element) element.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 60);
  }

  // Save updated credential
  async function handleUpdateCredential(e) {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const res = await fetch(`/api/credentials/${editId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: editName,
        username: editUsername,
        password: editPassword,
        notes: editNotes,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      return setToast({
        show: true,
        message: data.message,
        bg: "danger",
      });
    }

    setToast({ show: true, message: "Credential updated!", bg: "success" });

    // Clear edit fields
    setEditId("");
    setEditName("");
    setEditUsername("");
    setEditPassword("");
    setEditNotes("");

    // Refresh list
    reloadCredentials();
  }

  // Helper to reload all credentials.
  async function reloadCredentials() {
    const token = localStorage.getItem("token");

    const res = await fetch(`/api/credentials/${divisionId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (res.ok) {
      setCredentials(data);
    }
  }

  const creds = (
    <Container className="mt-4">
      <h2 className="text-white mb-4">Credentials</h2>
      <Button as={Link} to="/dashboard" variant="secondary" className="mb-3">
        ← Back to Dashboard
      </Button>
      {/*  Add cred */}
      <Card className="mb-4">
        <Card.Body>
          <h5>Add Credential</h5>

          <Form onSubmit={handleAddCredential}>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control value={name} onChange={(e) => setName(e.target.value)} required />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control value={username} onChange={(e) => setUsername(e.target.value)} required />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control value={password} onChange={(e) => setPassword(e.target.value)} required />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Notes</Form.Label>
              <Form.Control value={notes} onChange={(e) => setNotes(e.target.value)} />
            </Form.Group>

            <Button variant="success" type="submit" className="w-100">
              Add
            </Button>
          </Form>
        </Card.Body>
      </Card>

      {/* List cred */}
      <Row>
        {credentials.map((cred) => (
          <Col md={4} key={cred._id} className="mb-4">
            <Card className="shadow-sm">
              <Card.Body>
                <Card.Title>{cred.name}</Card.Title>

                <p>
                  <strong>Username:</strong> {cred.username}
                </p>
                <p>
                  <strong>Password:</strong> {cred.password}
                </p>
                <p>
                  <strong>Notes:</strong> {cred.notes}
                </p>

                {user && user.role !== "normal" ? (
                  <Button variant="primary" className="w-100" onClick={() => beginEdit(cred)}>
                    Edit
                  </Button>
                ) : (
                  <Button variant="secondary" className="w-100" disabled>
                    Edit
                  </Button>
                )}
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Edit cred */}
      {editId && (
        <Card id="edit-form" className="mt-4">
          <Card.Body>
            <h5>Edit Credential</h5>

            <Form onSubmit={handleUpdateCredential}>
              <Form.Group className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control value={editName || ""} onChange={(e) => setEditName(e.target.value)} required />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Username</Form.Label>
                <Form.Control value={editUsername || ""} onChange={(e) => setEditUsername(e.target.value)} required />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control value={editPassword || ""} onChange={(e) => setEditPassword(e.target.value)} required />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Notes</Form.Label>
                <Form.Control value={editNotes || ""} onChange={(e) => setEditNotes(e.target.value)} />
              </Form.Group>

              <Button type="submit" variant="primary" className="w-100">
                Save Changes
              </Button>
            </Form>
          </Card.Body>
        </Card>
      )}

      {/* Toast */}
      <ToastContainer position="top-end" className="p-3">
        <Toast bg={toast.bg} show={toast.show} autohide delay={3000} onClose={() => setToast({ ...toast, show: false })}>
          <Toast.Header closeButton>
            <strong className="me-auto">Cool Tech</strong>
          </Toast.Header>
          <Toast.Body className="text-white">{toast.message}</Toast.Body>
        </Toast>
      </ToastContainer>
    </Container>
  );
  return creds;
}

export default CredentialsPage;
