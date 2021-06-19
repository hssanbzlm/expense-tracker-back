const setting = require("../setting/setting.model");

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
