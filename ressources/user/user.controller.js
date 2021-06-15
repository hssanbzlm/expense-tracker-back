const userModel = require("./user.model");

module.exports.login = async (req, res) => {};

module.exports.signUp = (req, res) => {
  var user = new userModel();
  user.email = req.body.email;
  user.password = req.body.password;
  user.active = false;
  user.name = req.body.name;
  user.lastName = req.body.lastName;
  user.save((err, rslt) => {
    if (err) {
      res.status(404).send({ error: err });
    }
    if (rslt) {
      res.status(200).send({ succe: "added" });
    }
  });
};
