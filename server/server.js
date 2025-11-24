require("dotenv").config();
const app = require("./src/app");
// Config for mongo.
const connectDB = require("./src/config/db");

// Port
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Start server
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});