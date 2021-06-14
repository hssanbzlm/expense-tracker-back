const router = require("express").Router();
const userController = require("./user.controller");

router.get("/login/:id", userController.login);
router.post("/signup", userController.signUp);

module.exports = router;
