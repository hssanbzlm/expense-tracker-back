const router = require("express").Router();
const settingController = require("../setting/setting.controller");

router.post(
  "/sendresetcode",
  settingController.checkResetCodeSent, //check if reset code is already sent
  settingController.sendResetCodeEmail,
  settingController.addResetCodeSetting
);
router.get("/checkresetcode/:resetcode", settingController.checkResetCode);

module.exports = router;
