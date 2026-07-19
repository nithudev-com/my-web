const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: "smtp.hostinger.com",
  port: 465,
  secure: true,
  auth: {
    user: "info@sextoyslovers.com",
    pass: "Sathvika@2026",
  },
  logger: true,
  debug: true
});

async function testSend() {
  try {
    let info = await transporter.sendMail({
      from: '"SexToys Lovers" <info@sextoyslovers.com>',
      to: "itwebcoders@gmail.com", 
      subject: "Test Email from SMTP",
      text: "This is a test email.",
      html: "<b>This is a test email.</b>"
    });
    console.log("Message sent: %s", info.messageId);
  } catch (error) {
    console.error("Error sending email:", error);
  }
}

testSend();
