const userModel = require("./user.model");
const token = require("../../tools/token");

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

module.exports.isUserActive = (req, res, next) => {
  const email = req.body.email;
  userModel.findOne({ email: email, active: true }, (err, userDoc) => {
    if (err) res.status(404).send({ err: err });
    if (userDoc) {
      req.userId = userDoc._id;
      next();
    } else {
      res.status(404).send({ msg: "user is not active" });
    }
  });
};

module.exports.addUser = async (req, res, next) => {
  try {
    const user = new userModel(req.body);
    const u = await user.save();
    req.idUser = u._id;
    next();
  } catch (e) {
    res.status(404).send({ err: e });
  }
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
