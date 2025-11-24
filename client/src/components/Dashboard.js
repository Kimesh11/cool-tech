import React from "react";
import { Container, Card, Button, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";

function Dashboard() {
  // Read logged-in user info from localStorage
  const user = JSON.parse(localStorage.getItem("user"));
  console.log(`User: ${user}`);

  // Check if user exists.
  if (!user) {
    return <p className="text-white mt-4">No user information available.</p>;
  }

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  }

  const dashboard = (
    <>
      <Container className="mt-4">
        <h2 className="text-white mb-4">Welcome, {user.username}</h2>

        {user.role === "admin" && (
          <Button as={Link} to="/admin" variant="warning" className="mb-3">
            Admin Panel
          </Button>
        )}

        <h4 className="text-white mb-3">Your Divisions</h4>

        <Row>
          {!user.divisions || user.divisions.length === 0 ? (
            <p className="text-white">You are not assigned to any divisions.</p>
          ) : (
            user.divisions.map((div) => (
              <Col md={4} key={div._id} className="mb-4">
                <Card className="shadow-sm">
                  <Card.Body>
                    <Card.Title>{div.name}</Card.Title>

                    <Card.Text className="text-muted">Organisational Unit ID: {div.organisationalUnit}</Card.Text>

                    <Button as={Link} to={`/credentials/${div._id}`} variant="primary" className="w-100">
                      View Credentials →
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))
          )}
        </Row>
      </Container>

      {/* Logout button */}
      <Container className="mt-3">
        <Button variant="danger" onClick={handleLogout} className="w-100">
          Logout
        </Button>
      </Container>
    </>
  );
  return dashboard;
}

export default Dashboard;
