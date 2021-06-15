const mongoose = require("mongoose");

const userShema = new mongoose.Schema({
  email: String,
  name: String,
  lastName: String,
  password: String,
  active: Boolean,
});

module.exports = mongoose.model("users", userShema);
