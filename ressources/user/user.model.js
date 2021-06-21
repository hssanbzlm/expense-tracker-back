const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const userShema = new mongoose.Schema({
  email: String,
  name: String,
  lastName: String,
  password: String,
  active: {
    type: Boolean,
    default: false,
  },
  expenses: [{ type: mongoose.Schema.Types.ObjectId, ref: "expenses" }],
});

userShema.pre("save", function (next) {
  var user = this;
  if (!user.isModified("password")) return next();
  bcrypt.hash(user.password, 10, function (err, hash) {
    if (err) {
      return next(err);
    }
    user.password = hash;
    next();
  });
});

userShema.methods.checkPassword = function (password) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, this.password, function (err, rslt) {
      if (err) reject(err);
      else resolve(rslt);
    });
  });
};

module.exports = mongoose.model("users", userShema);
