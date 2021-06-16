const router = require("express").Router();
const userController = require("./user.controller");

router.post("/login", userController.login);
router.post("/signup", userController.signUp);

module.exports = router;
