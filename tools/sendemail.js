const nodemailer = require("nodemailer");
const config = require("../config/index");
function nodeMailerCreateTransport() {
  return nodemailer.createTransport({
    auth: { user: config.sendEmail, pass: config.emailPassword },
    service: "Gmail",
    tls: {
      rejectUnauthorized: false,
    },
  });
}

module.exports.nodeMailerCreateTransport = nodeMailerCreateTransport;
