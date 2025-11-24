const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },

  role: {
    type: String,
    enum: ["normal", "management", "admin"],
    default: "normal",
  },

  // User can belong to multiple OUs
  organisationalUnits: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "OrganisationalUnit",
    },
  ],

  // User can belong to multiple divisions
  divisions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Division",
    },
  ],
});

module.exports = mongoose.model("User", UserSchema);
