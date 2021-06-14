const mongoose = require("mongoose");

const userShema = new mongoose.Schema({
  email: String,
  password: String,
  active: Boolean,
});

module.exports = mongoose.model("users", userShema);
