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
    if (expense) res.status(200).json(expense);
  });
};

module.exports.addExpense = async (req, res, next) => {
  const expense = new expenseModel(req.body);
  expense.createdBy = req.idUser;
  try {
    const ex = await expense.save();
    req.expenseId = ex._id;
    next();
  } catch (err) {
    res.status(404).send({ err: err });
  }
};
module.exports.addExpenseIdToUser = (req, res) => {
  const idUser = req.idUser;
  const expenseId = req.expenseId;
  userModel.findByIdAndUpdate(
    idUser,
    { $push: { expenses: expenseId } },
    { new: true },
    (err, user) => {
      if (err) res.status(404).send({ err: err });
      if (user) res.status(200).json(user);
    }
  );
};

module.exports.deleteExpense = (req, res, next) => {
  const expenseId = req.params.expenseId;
  expenseModel.findByIdAndRemove(expenseId, (err, expense) => {
    if (expense) {
      req.idExpense = expense._id;
      next();
    }
    if (err) res.status(404).send({ err: err });
  });
};

module.exports.deleteIdExpenseFromUser = (req, res) => {
  const idExpense = req.idExpense;
  const idUser = req.idUser;
  userModel.findByIdAndUpdate(
    idUser,
    { $pull: { expenses: idExpense } },
    { new: true },
    (err, user) => {
      if (err) res.status(404).send({ err: err });
      if (user) res.status(200).json(user);
    }
  );
};

module.exports.updateExpense = (req, res) => {
  const expenseId = req.body.expenseId;
  expenseModel.findByIdAndUpdate(
    expenseId,
    req.body,
    { new: true },
    (err, expense) => {
      if (err) res.status(404).send({ err: err });
      if (expense) res.status(200).json(expense);
    }
  );
};
