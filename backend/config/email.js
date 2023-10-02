const nodemailer = require("nodemailer")

const sendEmail = async options => {
  const transport = {
    service: "gmail",
    auth: {
      user: process.env.SEFP_USER,
      pass: process.env.SEFP_PASS
    }
  }

  const transporter = nodemailer.createTransport(transport)
  const message = {
    from: `${process.env.SEFP_FROM_NAME} <${process.env.SEFP_FROM_EMAIL}>`,
    to: options.email,
    subject: options.subject,
    html: options.message
  }

  await transporter.sendMail(message);
}

module.exports = sendEmail;