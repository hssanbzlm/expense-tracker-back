const router = require("express").Router();
const userController = require("./user.controller");
const settingController = require("../setting/setting.controller");
router.post("/login", userController.login);
router.post(
  "/signup",
  userController.checkUserExistence,
  settingController.senEmailVerification,
  userController.addUser,
  settingController.saveSettings
);
router.get(
  "/verifemail/:code",
  settingController.verifCode,
  userController.activateUser
);
router.get("/checkUserActive", userController.isUserActive); //is the user even active?
router.post("/updateUser", userController.findUser, userController.updateUser);

//save settings: saving user id + user code verification (sent with email) in setting document

module.exports = router;
