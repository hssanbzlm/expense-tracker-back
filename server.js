const express = require("express");
const cors = require("cors");
const app = express();
const envConfig = require("./config");
const connectDb = require("./utils/db");
const userRouter = require("./ressources/user/user.router");
const protect = require("./tools/protect").protect;
const expenseRouter = require("./ressources/expense/expense.router");
const settingRouter = require("./ressources/setting/setting.router");
app.use(cors());
app.use(express.json());
app.use("/user", userRouter);
app.use("/setting", settingRouter);

app.use(protect); //all routing after this will be protected
// we can of course add it individually for each route => app.use('/expense',protect,expenseRouter)
app.use("/expense", expenseRouter);

module.exports.start = async () => {
  try {
    await connectDb();
    app.listen(envConfig.port, () => {
      console.log(envConfig.env);
      console.log(`I'm listening on port ${envConfig.port}`);
    });
  } catch (e) {
    console.log(e);
  }
};
