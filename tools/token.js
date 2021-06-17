const jwt = require("jsonwebtoken");
const config = require("../config");

module.exports.newToken = (user) => {
  return jwt.sign({ id: user.id }, config.jwtKey, { expiresIn: config.jwtExp });
};

module.exports.verifyToken = (token) =>
  new Promise((resolve, reject) => {
    try {
      const decoded = jwt.verify(token, config.jwtKey);
      resolve(decoded);
    } catch (err) {
      reject(err);
    }
  });
