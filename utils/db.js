const config = require("../config");
const mongoose = require("mongoose");

module.exports = (dbUri = config.dbUri) => {
  return mongoose.connect(
    dbUri,
    { dbName: config.dbName },
    {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    }
  );
};
