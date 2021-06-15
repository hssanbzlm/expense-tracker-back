const nodemailer = require("nodemailer");
const config = require("../config/index");
////nodemailer
function nodeMailerCreateTransport(auth, service) {
  return nodemailer.createTransport({
    auth: auth,
    service: service,
  });
}

function nodeMailerSendEmail(message) {
  nodeMailerCreateTransport(
    {
      user: config.sendEmail,
      pass: config.emailPassword,
    },
    "Gmail"
  ).sendMail(message, (err, info) => {
    if (err) {
      console.log("Error sending email " + err.message);
    }
    if (info) {
      console.log(info);
    }
  });
}
///nodemailer
module.exports.sendMail = nodeMailerSendEmail;
