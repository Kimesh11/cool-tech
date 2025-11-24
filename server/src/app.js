const express = require("express");

const app = express();
const authRoutes = require("./routes/auth.routes");
const credentialRoutes = require("./routes/credentials.routes");
const adminRoutes = require("./routes/admin.routes");
const divisionRoutes = require("./routes/divisions.routes");
const ouRoutes = require("./routes/ou.routes");

// Models
require("./models/user.model");
require("./models/ou.model");
require("./models/division.model");
require("./models/credentialRepository.model");

app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/credentials", credentialRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/divisions", divisionRoutes);
app.use("/api/organisationalUnits", ouRoutes);

module.exports = app;