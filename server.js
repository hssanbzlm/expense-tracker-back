const express = require("express");
const cors = require("cors");
const app = express();
const envConfig = require("./config");
const connectDb = require("./utils/db");
const userRouter = require("./ressources/user/user.router");
app.use(cors());
app.use(express.json());
app.use("/user", userRouter);

module.exports.start = async () => {
  try {
    await connectDb();
    app.listen(envConfig.port, () => {
      console.log(`I'm listening on port ${envConfig.port}`);
    });
  } catch (e) {
    console.log(e);
  }
};
