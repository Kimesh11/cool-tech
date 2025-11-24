import React from "react";
import AuthPage from "./components/AuthPage";
import Dashboard from "./components/Dashboard";
import CredentialsPage from "./components/CredentialsPage";
import AdminDashboard from "./components/admin/AdminDashboard";
import ManageUsers from "./components/admin/ManageUsers";
import AssignDivisions from "./components/admin/AssignDivisions";
import AssignOUs from "./components/admin/AssignOUs";
import ChangeRoles from "./components/admin/ChangeRoles";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/global.css";

function App() {
  const app = (
    <Router>
      <Routes>
        {/* Default route */}
        <Route path="/" element={<AuthPage />} />

        {/* Dashboard route */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Credentials route */}
        <Route path="/credentials/:divisionId" element={<CredentialsPage />} />

        {/* Admin routes */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<ManageUsers />} />
        <Route path="/admin/divisions" element={<AssignDivisions />} />
        <Route path="/admin/ous" element={<AssignOUs />} />
        <Route path="/admin/roles" element={<ChangeRoles />} />
      </Routes>

      {/* Cosmic Stars Background */}
      <div className="cosmic-stars">
        {Array.from({ length: 100 }).map((_, i) => (
          <span
            key={i}
            style={{
              top: Math.random() * 100 + "%",
              left: Math.random() * 100 + "%",
              animationDelay: Math.random() * 10 + "s",
            }}
          />
        ))}
      </div>
    </Router>
  );
  return app;
}

export default App;
