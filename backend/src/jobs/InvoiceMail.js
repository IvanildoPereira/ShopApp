const sgMail = require('../lib/Mail')
const ejs = require("ejs");
const dateFormat = require('dateformat');
const pdf = require("html-pdf");

module.exports = {
  key: "InvoiceMail",
  async handle({ data }) {
    const { user, order, products } = data;

    const pdfInvoice = async () => {
      const contentHtml = await ejs.renderFile(
        "./documents/InvoiceTemplate.ejs",
        { user, order, products, dateFormat }
      );
      

      return new Promise((resolve, reject) => {
        pdf.create(contentHtml).toBuffer((err, buffer) => {
          if (err) {
            reject(err);
          } else {
            resolve(buffer);
          }
        });
      });
    };

    const bufferPdf = await pdfInvoice();
    const stringPdf = await bufferPdf.toString("base64")

    await sgMail.send({
      from: process.env.SENDGRID_EMAIL,
      to: user.email,
      subject: `invoice#${order.id} - ${user.name}`,
      html: `<p>Hello, <b>${user.name}</b>, your invoice is on the attachments</p>`,
      attachments: [
        {
          content: stringPdf,
          filename: "attachment.pdf",
          type: "application/pdf",
          disposition: "attachment"
        }
      ]
    });

    
    
  },
};
