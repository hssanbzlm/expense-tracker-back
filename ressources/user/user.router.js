const router = require("express").Router();
const userController = require("./user.controller");
const settingController = require("../setting/setting.controller");

router.post("/login", userController.login);
router.post(
  "/signup",
  userController.checkUserExistence,
  userController.senEmailVerification,
  userController.saveUser,
  settingController.saveSettings
);
router.get(
  "/verifemail/:code",
  userController.verifCode,
  userController.activateUser
);
//save settings: saving user id + user code verification (sent with email) in setting document

module.exports = router;
