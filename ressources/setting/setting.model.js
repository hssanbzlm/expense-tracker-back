const mongoose = require("mongoose");

const setting = new mongoose.Schema({
  idUser: { type: "ObjectId", ref: "user" },
  verifCode: String,
  resetPasswordCode: Number,
});

module.exports = mongoose.model("settings", setting);
