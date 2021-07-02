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
router.get("/checkUserActive", userController.isUserActive);
router.post(
  "/sendresetcode",
  userController.checkResetCodeSent,
  userController.sendResetCodeEmail,
  userController.addResetCodeSetting
);

router.get("/checkresetcode/:resetcode", userController.checkResetCode);
router.post("/updateUser", userController.findUser, userController.updateUser);

//save settings: saving user id + user code verification (sent with email) in setting document

module.exports = router;
