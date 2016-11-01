import bcrypt from 'bcrypt';

import Users from './../models/users';
import config from './../config/config';
import sessionsService from './../services/sessions';
import emailService from './../services/email';

const service = {};

// Create new user
service.create = (profile) => {
  const token = bcrypt.genSaltSync().replace(/\//g, '-').replace(/[^a-zA-Z0-9-_]/g, '');

  return Users.create({
    username: profile.username,
    email: profile.email,
    password: (Math.random() + 1).toString(36).substr(2, 10),
    role: 'user',
    status: config.verifyEmail ? 'not_validated' : 'validated',
    tokenValidate: config.verifyEmail ? token : null,
    emailValidate: !config.verifyEmail,
  })
  .then(User => {
    if (config.verifyEmail && User.$options.isNewRecord) {
      emailService.sendValidateEmail(User);
    }

    return sessionsService.createNewSession(User)
    .then(Session => {
      return {
        User,
        Session,
        msg: 'Your account was created',
      };
    });
  });
};

// Send validation email
service.sendValidationEmail = (User) => {
  if (User.emailValidate || !User.tokenValidate) {
    throw new Error('Invalid user email or already validated account');
  }
  emailService.sendValidateEmail(User);
  return Promise.resolve({ msg: 'Validation email sent to ' + User.email });
};

// Validate User email
service.validateEmail = (loggedUser, userSession, tokenValidate) => {
  if (loggedUser && userSession && tokenValidate) {
    if (loggedUser.tokenValidate === tokenValidate && !loggedUser.emailValidate) {
      return doValidation(loggedUser, userSession);
    }
    throw new Error('Invalid token or already validated account');
  } else {
    return Users.findOne({ where: { tokenValidate, emailValidate: 0 } })
      .then(User => {
        if (!User) {
          throw new Error('Invalid token or already validated account');
        }
        return doValidation(User);
      });
  }

  function doValidation(User, Session) {
    // valid user then do email validation
    User.emailValidate = true;
    User.tokenValidate = null;
    User.status = 'validated';
    return User.save()
      .then(updatedUser => {
        if (Session) {
          return {
            User: updatedUser,
            Session,
            msg: 'Your email account was validated',
          };
        }

        return sessionsService.createNewSession(updatedUser)
          .then(newSession => {
            return {
              User: updatedUser,
              Session: newSession,
              msg: 'Your email account was validated',
            };
          });
      });
  }
};

// Continues signup process store user profile options
service.storeProfile = (User, Session, profile) => {
  if (User.status !== 'validated') {
    throw new Error('Invalid user status');
  }

  if (profile.password !== profile.verifyPassword) {
    throw new Error('Passwords must match');
  }

  if (profile.password.length < 6) {
    throw new Error('Password too short');
  }

  const salt = bcrypt.genSaltSync();

  return User.update({
    firstName: profile.firstName,
    lastName: profile.lastName,
    password: bcrypt.hashSync(profile.password, salt),
    status: 'not_active',
  }).then(updatedUser => {
    return {
      Session,
      User: updatedUser,
      msg: 'Your profile was saved',
    };
  });
};

// Finish signup process: 'active' user profile and send welcome email
service.activate = (User, Session) => {
  if (User.status !== 'not_active') {
    throw new Error('Invalid user');
  }

  return User.update({
    status: 'active',
  }).then(updatedUser => {
    emailService.sendWelcomeEmail(User);
    return {
      Session,
      User: updatedUser,
      msg: 'Welcome ' + User.firstName + ' ' + User.lastName + '!',
    };
  });
};

module.exports = service;
