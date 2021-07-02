const userModel = require("./user.model");
const token = require("../../tools/token");
const nodeMailerCreateTransport =
  require("../../tools/sendemail").nodeMailerCreateTransport;
const config = require("../../config");
const { v4: uuidv4 } = require("uuid");
const settingModel = require("../setting/setting.model");
const { randomNumber } = require("../../tools/randomnumber");

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
      req.idUser = userDoc._id;
      next();
    }
  });
};

module.exports.isUserActive = (req, res) => {
  const email = req.body.email;
  userModel.findOne({ email: email, active: true }, (err, userDoc) => {
    if (err) res.status(404).send({ err: err });
    if (userDoc) {
      res.status(200).send({ userId: userDoc._id });
    } else {
      res.status(404).send({ msg: "user is not active" });
    }
  });
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
    res.status(200).send({ msg: "you have already an account" });
  }
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

module.exports.checkResetCodeSent = (req, res, next) => {
  const idUser = req.body.idUser;
  settingModel.findOne({ idUser: idUser }, (err, settDoc) => {
    if (err) res.status(404).send({ err: err });
    if (settDoc) {
      res.status(200).send({ msg: "reset code is already sent" });
    } else {
      next();
    }
  });
};

module.exports.addResetCodeSetting = async (req, res) => {
  const idUser = req.body.idUser;
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

module.exports.checkResetCode = (req, res) => {
  const resetCode = req.params.resetcode;
  const idUser = req.body.idUser;
  settingModel.findOneAndDelete(
    { resetPasswordCode: resetCode, idUser: idUser },
    (err, setting) => {
      if (err) res.status(404).send({ err: err });
      if (setting) res.status(200).send({ succe: "succee" });
      else res.status(404).send({ error: "not found" });
    }
  );
};
module.exports.findUser = (req, res, next) => {
  const idUser = req.body.idUser;
  userModel.findById(idUser, (err, userDoc) => {
    if (err) {
      res.status(404).send({ err: err });
    }
    if (userDoc) {
      req.user = userDoc;
      next();
    } else {
      res.status(404).send({ err: "err" });
    }
  });
};

module.exports.updateUser = async (req, res) => {
  userDoc = req.user;
  userDoc.password = req.body.password;
  try {
    await userDoc.save();
    res.status(200).send({ msg: "succee" });
  } catch (err) {
    res.status(404).send({ err: err });
  }
};
