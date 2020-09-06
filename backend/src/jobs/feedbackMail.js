const sgMail = require('../lib/Mail')

module.exports = {
  key: 'feedbackMail',
  async handle({ data }) {

    await sgMail.send({
      from: process.env.SENDGRID_EMAIL,
      to: process.env.SECOND_EMAIL,
      subject: `Feedback - ${data.subject}`,
      html: `
            <p><b>From: </b>${data.email}</p>
            <p><b>Message: </b>${data.message}</p>
        `
    });
  },
};