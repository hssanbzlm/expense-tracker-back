const router = require("express").Router();
const expenseController = require("./expense.controller");

router.get("/getexpenses", expenseController.getExpenses);
router.get("/getexpense/:expenseId", expenseController.getExpense);
router.post(
  "/addexpense",
  expenseController.addExpense,
  expenseController.addExpenseIdToUser
);
router.delete(
  "/deleteexpense/:expenseId",
  expenseController.deleteExpense,
  expenseController.deleteIdExpenseFromUser
);
router.put("/updateexpense", expenseController.updateExpense);

module.exports = router;
