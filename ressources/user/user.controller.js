const userModel = require("./user.model");
const token = require("../../tools/token");
const nodeMailerCreateTransport =
  require("../../tools/sendemail").nodeMailerCreateTransport;
const config = require("../../config");

module.exports.login = async (req, res) => {
  const user = req.body;
  try {
    const u = await userModel.findOne({ email: user.email }).exec();
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
  nodeMailerCreateTransport().sendMail(
    {
      from: config.sendEmail,
      to: req.body.email,
      subject: "Email verification",
      text: "<b>Hello</b>",
    },
    (err, info) => {
      if (err) res.status(404).send({ err: err });
      if (info) {
        next();
      }
    }
  );
};

module.exports.saveUser = async (req, res) => {
  try {
    const user = new userModel(req.body);
    await user.save();
    res.status(200).send({ succe: "succe" });
  } catch (e) {
    res.status(404).send({ err: e });
  }
};
