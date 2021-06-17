const nodemailer = require("nodemailer");
const config = require("../config/index");
function nodeMailerCreateTransport() {
  return nodemailer.createTransport({
    auth: { user: config.sendEmail, pass: config.emailPassword },
    service: "Gmail",
  });
}

module.exports.nodeMailerCreateTransport = nodeMailerCreateTransport;
