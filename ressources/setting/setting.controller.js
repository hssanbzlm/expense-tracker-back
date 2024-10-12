const setting = require("../setting/setting.model");
const settingModel = require("../setting/setting.model");
const { v4: uuidv4 } = require("uuid");
const config = require("../../config");
const { nodeMailerCreateTransport } = require("../../tools/sendemail");
const { randomNumber } = require("../../tools/randomnumber");
//save userid + code verif in setting model
module.exports.saveSettings = async (req, res) => {
  const idUser = req.idUser;
  const verifCode = req.codeVerif;
  try {
    const settings = new setting({ idUser, verifCode });
    await settings.save();
    res.status(200).json(settings);
  } catch (err) {
    res.status(404).send({ err: err });
  }
};

module.exports.senEmailVerification = (req, res, next) => {
  if (!req.idUser) {
    // from the previous middleware we get userId if user exist
    const codeVerif = uuidv4();
    nodeMailerCreateTransport().sendMail(
      {
        from: config.sendEmail,
        to: req.body.email,
        subject: "Email verification",
        text: `Click this link to verify your email: ${config.frontAppVerif}${codeVerif}`,
      },
      (err, info) => {
        if (err) res.status(404).send({ err: err });
        else if (info) {
          req.codeVerif = codeVerif;
          next();
        }
      }
    );
  } else {
    res.status(400).send({ msg: "you have already an account" });
  }
};

module.exports.verifCode = async (req, res, next) => {
  const code = req.params.code;
  try {
    const doc = await settingModel.findOneAndDelete({ verifCode: code });
    if (doc) {
      req.idUser = doc.idUser;
      next();
    } else {
      res.status(404).send("not found");
    }
  } catch (err) {
    res.status(500).send({ err });
  }
};

module.exports.checkResetCodeSent = async (req, res, next) => {
  const idUser = req.userId;
  try {
    const doc = await settingModel.findOne({ idUser });
    if (doc) {
      res.status(200).send({ msg: "reset code is already sent" });
    } else {
      next();
    }
  } catch (err) {
    res.status(500).send({ err });
  }
};

module.exports.sendResetCodeEmail = (req, res, next) => {
  const resetCode = randomNumber(1000, 9999);
  nodeMailerCreateTransport().sendMail(
    {
      from: config.sendEmail,
      to: req.body.email,
      subject: "Your account reset code",
      text: `Put this number in code filed: ${resetCode}`,
    },
    (err, info) => {
      if (err) res.status(404).send({ err: err });
      if (info) {
        req.resetCode = resetCode;
        next();
      }
    }
  );
};

module.exports.addResetCodeSetting = async (req, res) => {
  const idUser = req.userId;
  const resetCode = req.resetCode;
  const setting = new settingModel({
    idUser: idUser,
    resetPasswordCode: resetCode,
  });
  try {
    const sett = await setting.save();
    res.status(200).send({ succe: "succee" });
  } catch (err) {
    res.status(404).json(err);
  }
};

module.exports.checkResetCode = async (req, res) => {
  const resetCode = req.params.resetcode;
  const idUser = req.userId;
  try {
    const doc = await settingModel.findOneAndDelete({
      resetPasswordCode: resetCode,
      idUser: idUser,
    });
    if (doc) res.status(200).send({ succes: "check code has succeed" });
    else {
      res.status(404).send({ error: "not found" });
    }
  } catch (err) {
    res.status(500).send({ err });
  }
};
