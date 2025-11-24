const mongoose = require("mongoose");

const DivisionSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },

  organisationalUnit: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "OrganisationalUnit",
    required: true,
  },

  credentialRepository: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CredentialRepository",
  },
});

module.exports = mongoose.model("Division", DivisionSchema);
