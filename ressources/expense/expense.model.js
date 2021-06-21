const mongoose = require("mongoose");

const expenseShema = new mongoose.Schema({
  date: Date,
  amount: Number,
  remark: String,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
});

module.exports = mongoose.model("expenses", expenseShema);
