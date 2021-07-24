const router = require("express").Router();
const settingController = require("../setting/setting.controller");
const userController = require("../user/user.controller");
router.post(
  "/sendresetcode",
  userController.isUserActive,
  settingController.checkResetCodeSent, //check if reset code is already sent
  settingController.sendResetCodeEmail, //send reset code if it is not sent before to this user
  settingController.addResetCodeSetting // add reset code sent with mail to setting document to be cheked later
);
router.post(
  "/checkresetcode/:resetcode",
  userController.isUserActive, //here I choose to check resetcode + userId together so
  settingController.checkResetCode // I used isUserActive middleware to get userId from email(body) before checkinh
); // reset code

module.exports = router;
