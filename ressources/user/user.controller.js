const userModel = require("./user.model");

module.exports.login = async (req, res) => {
  const user = req.body;
  try {
    const u = await userModel.findOne({ email: user.email }).exec();
    if (u) {
      u.checkPassword(user.password).then(
        (onSucced) => {
          if (onSucced) res.status(200).send({ succed: "succed" });
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

module.exports.signUp = async (req, res) => {
  var user = new userModel();
  user.email = req.body.email;
  user.password = req.body.password;
  user.active = false;
  user.name = req.body.name;
  user.lastName = req.body.lastName;
  try {
    const u = await user.save();
    res.status(200).send({ succed: "succed" });
  } catch (err) {
    console.log(err);
    res.status(404).send({ error: err });
  }
};
