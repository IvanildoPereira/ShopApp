const sgMail = require('../lib/Mail')

module.exports = {
  key: 'RegistrationMail',
  async handle({ data }) {
    const { user } = data;

    

    await sgMail.send({
      from: process.env.SENDGRID_EMAIL,
      to: user.email,
      subject: `Welcome ${user.name}`,
      html: `Hello, ${user.name}, we're great that you want join and buy in your platform!`
    });
  },
};