const nodemailer = require("nodemailer")

exports.sendEmail = async (message) => {
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.NODEMAILER_USERNAME,
      pass: process.env.NODEMAILER_PASSWORD
    }
  })

  // send mail with defined transport object
  let info = await transporter.sendMail(message)

  console.log("Message sent: %s", info.messageId)

  return "email sent"
}
