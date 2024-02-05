const expenseModel = require("./expense.model");
const userModel = require("../user/user.model");
module.exports.getExpenses = (req, res) => {
  const idUser = req.idUser; //it is available after user login
  userModel
    .findOne({ _id: idUser })
    .select("-password")
    .populate("expenses")
    .then(
      (v) => {
        res.status(200).json(v);
      },
      (err) => {
        res.status(404).send({ err: err });
      }
    );
};

module.exports.getExpense = (req, res) => {
  const expenseId = req.params.expenseId;
  expenseModel.findById(expenseId, (err, expense) => {
    if (err) res.status(404).send({ err: err });
    else if (expense) res.status(200).json(expense);
    else res.status(404).send({ err: "not found" });
  });
};

module.exports.addExpense = async (req, res, next) => {
  const expense = new expenseModel(req.body);
  expense.createdBy = req.idUser;
  try {
    const ex = await expense.save();
    req.expense = ex;
    next();
  } catch (err) {
    res.status(404).send({ err: err });
  }
};
module.exports.addExpenseIdToUser = async (req, res) => {
  const idUser = req.idUser;
  const expenseId = req.expense;
  const userDoc = await userModel.findByIdAndUpdate(
    idUser,
    { $push: { expenses: expenseId } },
    { new: true }
  );
  if (userDoc) {
    res.status(200).json(req.expense);
  } else res.status(404).send({ err: "not found" });
};

module.exports.deleteExpense = (req, res, next) => {
  const expenseId = req.params.expenseId;
  expenseModel.findByIdAndRemove(expenseId, (err, expense) => {
    if (expense) {
      req.idExpense = expense._id;
      next();
    } else if (err) res.status(404).send({ err: err });
    else res.status(404).send({ err: "not found" });
  });
};

module.exports.deleteIdExpenseFromUser = async (req, res) => {
  const idExpense = req.idExpense;
  const idUser = req.idUser;
  const userDoc = await userModel.findByIdAndUpdate(
    idUser,
    { $pull: { expenses: idExpense } },
    { new: true }
  );

  if (userDoc) {
    res.status(200).json(userDoc);
  } else res.status(404).send({ err: "not found" });
};

module.exports.updateExpense = async (req, res) => {
  const expenseId = req.body._id;
  const expenseDoc = await expenseModel.findByIdAndUpdate(expenseId, req.body, {
    new: true,
  });
  if (expenseDoc) {
    res.status(200).json(expenseDoc);
  } else {
    res.status(404).send({ err: "error while updating" });
  }
};
