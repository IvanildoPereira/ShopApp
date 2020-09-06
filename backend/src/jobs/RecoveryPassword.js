const sgMail = require('../lib/Mail')

module.exports = {
  key: 'RecoveryPassword',
  async handle({ data }) {
    const { email, token } = data;

    

    await sgMail.send({
      from: process.env.SENDGRID_EMAIL,
      to: email,
      subject: `ShopApp - Recovery Password`,
      html: `<p>Hello, to reset the password <a href = "http://localhost:3000/reset_password/${token}" target = "_blank">click here</a></p>`
    });
  },
};