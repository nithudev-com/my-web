const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
  host: "smtp.hostinger.com",
  port: 465,
  secure: true,
  auth: {
    user: "info@sextoyslovers.com",
    pass: "Sathvika@2026"
  }
});
transporter.verify(function(error, success) {
  if (error) {
    console.log("SMTP Error:", error);
  } else {
    console.log("Server is ready to take our messages");
  }
});
