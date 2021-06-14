const merge = require("lodash").merge;
const env = process.env.Node_ENV || "development";

const baseConfig = {}; // maybe we add some base config
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
