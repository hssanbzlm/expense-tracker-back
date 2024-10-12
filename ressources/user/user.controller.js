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

module.exports.checkUserExistence = async (req, res, next) => {
  try {
    const doc = await userModel.findOne({ email: req.body.email });
    if (!doc) {
      next();
    } else {
      req.idUser = doc._id;
      next();
    }
  } catch (err) {
    res.status(404).send({ err });
  }
};

module.exports.isUserActive = async (req, res, next) => {
  const email = req.body.email;
  try {
    const doc = await userModel.findOne({ email, active: true });
    if (doc) {
      req.userId = doc._id;
      next();
    } else {
      res.status(404).send({ msg: "user is not active" });
    }
  } catch (err) {
    res.status(404).send({ err });
  }
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

module.exports.activateUser = async (req, res) => {
  const idUser = req.idUser;
  const userDoc = await userModel.findByIdAndUpdate(
    idUser,
    { active: true },
    { new: true }
  );
  if (userDoc) {
    res.status(200).json(userDoc);
  } else {
    res.status(404).send({ err: "not found" });
  }
};

module.exports.findUser = async (req, res, next) => {
  const email = req.body.email;
  try {
    const doc = await userModel.findOne({ email });
    if (doc) {
      req.user = doc;
      next();
    } else {
      res.status(404).send({ res: "User not found" });
    }
  } catch (err) {
    res.status(500).send({ err });
  }
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
