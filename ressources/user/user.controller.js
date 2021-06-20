const userModel = require("./user.model");
const token = require("../../tools/token");
const nodeMailerCreateTransport =
  require("../../tools/sendemail").nodeMailerCreateTransport;
const config = require("../../config");
const { v4: uuidv4 } = require("uuid");
const settingModel = require("../setting/setting.model");

module.exports.login = async (req, res) => {
  const user = req.body;
  try {
    const u = await userModel
      .findOne({ email: user.email, active: true })
      .exec();
    if (u) {
      u.checkPassword(user.password).then(
        (onSucced) => {
          if (onSucced) res.status(200).json({ token: token.newToken(u) });
          else res.status(404).send({ err: "verif your email and password" });
        },
        (onReject) => {
          res.status(404).send({ err: "verif your email and password " });
        }
      );
    } else {
      res.status(404).send({ err: "verif your email and password" });
    }
  } catch (e) {
    res.status(404).send({ err: "we have some problems" });
  }
};

module.exports.checkUserExistence = (req, res, next) => {
  userModel.findOne({ email: req.body.email }, (err, userDoc) => {
    if (err) res.status(404).send({ err: err });
    else if (!userDoc) {
      next();
    } else {
      res.status(200).send({ msg: "you already have an account" });
    }
  });
};

module.exports.senEmailVerification = (req, res, next) => {
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
};

module.exports.saveUser = async (req, res, next) => {
  try {
    const user = new userModel(req.body);
    const u = await user.save();
    req.idUser = u._id;
    next();
  } catch (e) {
    res.status(404).send({ err: e });
  }
};

module.exports.verifCode = (req, res, next) => {
  const code = req.params.code;
  settingModel.findOneAndRemove({ verifCode: code }, (err, setting) => {
    if (setting) {
      req.idUser = setting.idUser;
      next();
    }
    if (err) {
      res.status(404).send({ err });
    }
  });
};

module.exports.activateUser = (req, res) => {
  const idUser = req.idUser;
  userModel.findByIdAndUpdate(
    idUser,
    { active: true },
    { new: true },
    (err, user) => {
      if (err) res.status(404).send({ err });
      if (user) res.status(200).json(user);
    }
  );
};
