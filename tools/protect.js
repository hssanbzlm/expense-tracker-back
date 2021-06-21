const verifyToken = require("./token").verifyToken;

module.exports.protect = (req, res, next) => {
  const token = req.headers.authorization;
  if (token) {
    verifyToken(token.slice(7)).then(
      (v) => {
        req.idUser = v.id;
        next();
      },
      (err) => {
        res.status(404).send({ err: err });
      }
    );
  } else {
    res.status(404).send("you are not authorized please");
  }
};
