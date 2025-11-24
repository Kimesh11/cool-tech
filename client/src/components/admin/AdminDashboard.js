import React from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

function AdminDashboard() {
  // User data.
  const user = JSON.parse(localStorage.getItem("user"));

  // Only show dashboard.
  if (!user || user.role !== "admin") {
    window.location.href = "/dashboard";
    return null;
  }

  // Logout function.
  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  }
  const adminDash = (
    <Container className="mt-4">
      <h2 className="text-white mb-4">Admin Dashboard</h2>
      <Button as={Link} to="/dashboard" variant="secondary" className="mb-3 me-3">
        ← Back to User Dashboard
      </Button>

      {/* Logout */}
      <Button variant="danger" onClick={handleLogout} className="mb-3">
        Logout
      </Button>
      <Row>
        <Col md={6} lg={3} className="mb-4">
          <Card className="h-100">
            <Card.Body className="d-flex flex-column">
              <Card.Title>Manage Users</Card.Title>
              <Card.Text className="text-muted">View all users and their assignments.</Card.Text>
              <div className="mt-auto">
                <Button as={Link} to="/admin/users" variant="primary" className="w-100">
                  Open
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} lg={3} className="mb-4">
          <Card className="h-100">
            <Card.Body className="d-flex flex-column">
              <Card.Title>Assign Divisions</Card.Title>
              <Card.Text className="text-muted">Assign or remove divisions for users.</Card.Text>
              <div className="mt-auto">
                <Button as={Link} to="/admin/divisions" variant="primary" className="w-100">
                  Open
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} lg={3} className="mb-4">
          <Card className="h-100">
            <Card.Body className="d-flex flex-column">
              <Card.Title>Assign OUs</Card.Title>
              <Card.Text className="text-muted">Assign or remove organisational units.</Card.Text>
              <div className="mt-auto">
                <Button as={Link} to="/admin/ous" variant="primary" className="w-100">
                  Open
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} lg={3} className="mb-4">
          <Card className="h-100">
            <Card.Body className="d-flex flex-column">
              <Card.Title>Change Roles</Card.Title>
              <Card.Text className="text-muted">Promote/demote users (normal / management / admin).</Card.Text>
              <div className="mt-auto">
                <Button as={Link} to="/admin/roles" variant="primary" className="w-100">
                  Open
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
  return adminDash;
}

export default AdminDashboard;
