import React, { useState } from "react";
import { Container, Row, Col, Card, Form, Button, Toast, ToastContainer } from "react-bootstrap";

function AuthPage() {
  // Toast for user feedback
  const [toast, setToast] = useState({ show: false, message: "", bg: "" });

  // Login form state
  const [loginUser, setLoginUser] = useState({ username: "", password: "" });

  // Register form state
  const [registerUser, setRegisterUser] = useState({ username: "", password: "" });

  // Login
  async function handleLogin(e) {
    e.preventDefault();

    try {
      // API call.
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginUser),
      });

      const data = await res.json();

      // Validations.
      if (!res.ok) {
        return setToast({ show: true, message: data.message, bg: "danger" });
      }

      // Success toast.
      setToast({ show: true, message: "Login successful!", bg: "success" });
      localStorage.setItem("token", data.token); // save JWT

      // Fetch user data
      const detailsRes = await fetch("/api/auth/userDetails", {
        headers: {
          Authorization: `Bearer ${data.token}`,
        },
      });

      const detailsData = await detailsRes.json();
      localStorage.setItem("user", JSON.stringify(detailsData));

      // Redirect to dashboard
      window.location.href = "/dashboard";
    } catch (err) {
      setToast({ show: true, message: "Login failed", bg: "danger" });
    }
  }

  // Register.
  async function handleRegister(e) {
    e.preventDefault();

    try {
      // API call.
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registerUser),
      });

      const data = await res.json();

      if (!res.ok) {
        return setToast({ show: true, message: data.message, bg: "danger" });
      }

      // Success toast.
      setToast({ show: true, message: "Registered successfully!", bg: "success" });
    } catch (err) {
      setToast({ show: true, message: "Registration failed", bg: "danger" });
    }
  }

  const auth = (
    <>
      {/* Full-page centered layout */}
      <Container className="d-flex justify-content-center align-items-center vh-100">
        <Row className="w-100" style={{ maxWidth: "900px" }}>
          {/* Login */}
          <Col md={6} className="mb-4">
            <Card className="shadow-sm h-100">
              <Card.Body>
                <h3 className="text-center mb-3">Login</h3>

                <Form onSubmit={handleLogin}>
                  {/* Username */}
                  <Form.Group className="mb-3">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                      type="text"
                      value={loginUser.username}
                      onChange={(e) => setLoginUser({ ...loginUser, username: e.target.value })}
                      placeholder="Enter username"
                      required
                    />
                  </Form.Group>

                  {/* Password */}
                  <Form.Group className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      value={loginUser.password}
                      onChange={(e) => setLoginUser({ ...loginUser, password: e.target.value })}
                      placeholder="Enter password"
                      required
                    />
                  </Form.Group>

                  {/* Submit */}
                  <Button type="submit" className="w-100" variant="primary">
                    Login
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>

          {/* Register */}
          <Col md={6} className="mb-4">
            <Card className="shadow-sm h-100">
              <Card.Body>
                <h3 className="text-center mb-3">Register</h3>

                <Form onSubmit={handleRegister}>
                  {/* Username */}
                  <Form.Group className="mb-3">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                      type="text"
                      value={registerUser.username}
                      onChange={(e) => setRegisterUser({ ...registerUser, username: e.target.value })}
                      placeholder="Create username"
                      required
                    />
                  </Form.Group>

                  {/* Password */}
                  <Form.Group className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      value={registerUser.password}
                      onChange={(e) => setRegisterUser({ ...registerUser, password: e.target.value })}
                      placeholder="Create password"
                      required
                    />
                  </Form.Group>

                  {/* Submit */}
                  <Button type="submit" className="w-100" variant="success">
                    Register
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Toast */}
      <ToastContainer position="top-end" className="p-3">
        <Toast bg={toast.bg} show={toast.show} autohide delay={3000} onClose={() => setToast({ ...toast, show: false })}>
          <Toast.Header closeButton>
            <strong className="me-auto">Cool Tech</strong>
            <small>Now</small>
          </Toast.Header>

          <Toast.Body className="text-white">{toast.message}</Toast.Body>
        </Toast>
      </ToastContainer>
    </>
  );
  return auth;
}

export default AuthPage;
