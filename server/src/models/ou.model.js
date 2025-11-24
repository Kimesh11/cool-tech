const mongoose = require("mongoose");

const OrganisationalUnitSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },

  // An OU has many divisions
  divisions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Division",
    },
  ],
});

module.exports = mongoose.model("OrganisationalUnit", OrganisationalUnitSchema);
