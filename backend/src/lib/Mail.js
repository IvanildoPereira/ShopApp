// import nodemailer from 'nodemailer';
// import mailConfig from '../config/mail';

// export default nodemailer.createTransport(mailConfig);
const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

module.exports = sgMail;