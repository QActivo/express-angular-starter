import Nodemailer from 'nodemailer';
import config from './../config/config';

const service = {};

const transporter = Nodemailer.createTransport({
  service: config.emailService,
  auth: config.auth,
});

function sendEmail(mailOptions) {
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log('Enviado: ' + info.response);
    }
  });
}

service.sendValidateEmail = (email, token) => {
  const content = 'Please enter <a href=\"' + config.urlBaseClient + '/user/validate/' + token +
  '\"> here </a>';
  const subject = 'Validate Email';
  const mailOptions = {
    to: email,
    subject,
    html: '<b>' + content + '</b>',
  };
  sendEmail(mailOptions);
};

service.sendRecoveryEmail = (email, token) => {
  const content = 'Please enter <a href=\"' + config.urlBaseClient + '/user/recovery/' + token +
  '\"> here </a> to change your password.';
  const subject = 'Recovery Password';
  const mailOptions = {
    to: email,
    subject,
    html: '<b>' + content + '</b>',
  };
  sendEmail(mailOptions);
};

module.exports = service;
