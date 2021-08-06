const merge = require("lodash").merge;
const env = process.env.NODE_ENV || "development";

const baseConfig = {
  env,
  sendEmail: process.env.sendEmail,
  emailPassword: process.env.emailPassword,
  jwtKey: process.env.jwtKey,
  jwtExp: "100d",
}; // maybe we add some base config
let envConfig = {};
switch (env) {
  case "development":
    envConfig = require("./development");
    break;
  case "production":
    envConfig = require("./production");
    break;
}

module.exports = merge(baseConfig, envConfig);
