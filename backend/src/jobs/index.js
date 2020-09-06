// export { default as RegistrationMail } from './RegistrationMail';
// export { default as InvoiceMail } from './InvoiceMail';
// export { default as feedbackMail } from './feedbackMail';
// export { default as RecoveryPassword } from './RecoveryPassword';

const RegistrationMail = require('./RegistrationMail');
const InvoiceMail = require('./InvoiceMail');
const feedbackMail = require('./feedbackMail');
const RecoveryPassword = require('./RecoveryPassword');

module.exports = {
    RegistrationMail,
    InvoiceMail,
    feedbackMail,
    RecoveryPassword
}