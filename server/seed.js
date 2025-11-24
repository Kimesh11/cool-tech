/**
 * This script inserts sample data into the database instead of manually adding for each model.
 * Run ONCE with:  node seed.js
 */
require("dotenv").config();
const mongoose = require("mongoose");
// To safely store passwords.
const bcrypt = require("bcryptjs");

const User = require("./src/models/user.model");
const OrganisationalUnit = require("./src/models/ou.model");
const Division = require("./src/models/division.model");
const Credential = require("./src/models/credentialRepository.model");

async function runSeed() {
  try {
    console.log("Connecting to DB...");
    await mongoose.connect(process.env.MONGO_URI);

    console.log("Clearing old data...");
    await User.deleteMany({});
    await OrganisationalUnit.deleteMany({});
    await Division.deleteMany({});
    await Credential.deleteMany({});

    console.log("Creating Organisational Units...");
    const ous = await OrganisationalUnit.insertMany([
      { name: "News Management" },
      { name: "Software Reviews" },
      { name: "Hardware Reviews" },
      { name: "Opinion Publishing" },
    ]);

    const [news, software, hardware, opinion] = ous;

    console.log("Creating Divisions...");
    const divisions = await Division.insertMany([
      { name: "IT Team", organisationalUnit: news._id },
      { name: "Writers", organisationalUnit: news._id },

      { name: "Dev Team", organisationalUnit: software._id },
      { name: "QA Team", organisationalUnit: software._id },

      { name: "Analysts", organisationalUnit: hardware._id },
      { name: "Design Team", organisationalUnit: opinion._id },
    ]);

    console.log("Creating Users...");
    const hashedPass = await bcrypt.hash("password123", 10);

    const users = await User.insertMany([
      {
        username: "normalUser",
        password: hashedPass,
        role: "normal",
        divisions: [divisions[1]._id], // Writers
        organisationalUnits: [news._id],
      },
      {
        username: "managerUser",
        password: hashedPass,
        role: "management",
        divisions: [divisions[2]._id], // Dev Team
        organisationalUnits: [software._id],
      },
      {
        username: "adminUser",
        password: hashedPass,
        role: "admin",
        divisions: [
          divisions[0]._id,
          divisions[2]._id,
          divisions[4]._id,
        ],
        organisationalUnits: [news._id, software._id, hardware._id],
      },
    ]);

    console.log("Creating Credentials...");
    await Credential.insertMany([
        {
          name: "WordPress Admin Login",
          username: "wp_admin",
          password: "wp_pass",
          notes: "WordPress login for News site",
          division: divisions[1]._id,
        },
        {
          name: "Linux Server Root",
          username: "server_root",
          password: "root123",
          notes: "Main Linux server",
          division: divisions[0]._id,
        },
        {
          name: "Development Git Repo",
          username: "dev_repo",
          password: "git123",
          notes: "Git repo login",
          division: divisions[2]._id,
        },
        {
          name: "QA Dashboard Login",
          username: "qa_dashboard",
          password: "qa_pass",
          notes: "QA tool login",
          division: divisions[3]._id,
        },
        {
          name: "Hardware Analytics",
          username: "analytics_user",
          password: "ana88",
          notes: "Hardware analytics portal",
          division: divisions[4]._id,
        },
        {
          name: "Design Publishing Panel",
          username: "designer_acct",
          password: "design123",
          notes: "Opinion publishing panel",
          division: divisions[5]._id,
        },
      ]);
      

    console.log("\nSEED COMPLETE!");
    console.log("Logins you can use:");
    console.log("normalUser / password123");
    console.log("managerUser / password123");
    console.log("adminUser   / password123");

    process.exit();
  } catch (err) {
    console.error("Seed error:", err);
    process.exit(1);
  }
}

runSeed();
