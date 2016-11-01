import path from 'path';
import MandrillTransport from 'nodemailer-mandrill-transport';
import EmailTemplates from 'email-templates';
import Nodemailer from 'nodemailer';
import config from './../config/config';

const service = {};
const templatesDir = path.resolve(__dirname, '..', 'templates');
const transporter = config.mandrillAPIKEY ?
  Nodemailer.createTransport(MandrillTransport({ auth: { apiKey: config.mandrillAPIKEY } })) :
  Nodemailer.createTransport({ service: config.emailService, auth: config.auth });

function sendEmail(mailOptions) {
  return new Promise((resolve, reject) => {
    if (mailOptions.notification && !config.sendEmailNotifications) {
      resolve('ok');
      return;
    }
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        reject(error);
      } else {
        resolve(info);
      }
    });
  });
}

function sendWithTemplate(templateData, User, subjectEmail, templateName, notification) {
  const template = new EmailTemplates.EmailTemplate(path.join(templatesDir, templateName));
  return template.render(templateData)
    .then(results => {
      return sendEmail({
        from: 'mean@qactivo.com',
        to: User.email,
        subject: subjectEmail,
        html: results.html,
        text: results.text,
        notification,
      });
    })
    .catch(err => {
      console.log(err);
    });
}

service.sendValidateEmail = (User) => {
  const data = {
    url: config.urlBaseClient + 'signup/validation/' + User.tokenValidate,
    username: User.username,
  };
  return sendWithTemplate(data, User, 'Validate your Email address', 'validate-email');
};

service.sendRecoveryEmail = (User) => {
  const data = {
    url: config.urlBaseClient + 'user/recovery/' + User.tokenPassRecovery,
    username: User.username,
  };
  return sendWithTemplate(data, User, 'Recovery Password', 'recovery-password-email');
};

service.sendWelcomeEmail = (User) => {
  const data = {
    url: config.urlBaseClient + 'login',
    firstName: User.firstName,
    lastName: User.lastName,
    username: User.username,
  };
  return sendWithTemplate(data, User, 'Welcome!', 'welcome-email');
};

module.exports = service;
