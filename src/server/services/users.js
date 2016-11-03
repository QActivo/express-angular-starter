import bcrypt from 'bcrypt-nodejs';

import Users from './../models/users';
import emailService from './../services/email';

const service = {};

service.getAll = (params) => {
  const query = {};
  // attributes
  query.attributes = ['id', 'username', 'email', 'role', 'status', 'firstName', 'lastName'];
  // conditions
  if (params.filter) {
    query.where = {
      $or: [
        { username: { $like: '%' + params.filter + '%' } },
        { firstName: { $like: '%' + params.filter + '%' } },
        { lastName: { $like: '%' + params.filter + '%' } },
        { email: { $like: '%' + params.filter + '%' } },
        { role: { $like: '%' + params.filter + '%' } },
      ],
    };
  }

  // pagination
  if (params.page) {
    const limit = (params.limit) ? parseInt(params.limit, 10) : 10;
    query.offset = (parseInt(params.page, 10) - 1) * limit;
  }
  if (params.limit) {
    query.limit = parseInt(params.limit, 10);
  }

  return Users.findAndCountAll(query);
};

service.getCount = (query) => {
  return Users.count(query);
};

// Find a user by his id and get all data / relations (used also in auth process)
service.findById = (id, includePassword) => {
  return service.findUser({ id }, includePassword);
};

// Find a user by his username and get all data / relations (used also in auth process)
service.findByUsername = (username, includePassword) => {
  return service.findUser({ username }, includePassword);
};

// Find a user by his email and get all data / relations (used also in auth process)
service.findByEmail = (email, includePassword) => {
  return service.findUser({ email }, includePassword);
};

// Find a user and realtions by custom where and check if include user password or not
service.findUser = (where, includePassword) => {
  const attributes = [
    'id', 'username', 'email', 'role', 'emailValidate', 'firstName', 'lastName',
    'picture', 'tokenValidate', 'tokenPassRecovery', 'tokenPassRecoveryExpiryDate', 'status',
  ];

  if (includePassword) {
    attributes.push('password');
  }

  return Users.findOne({ where, attributes });
};

service.destroy = (id) => {
  return Users.destroy({ where: { id } });
};

service.create = (user) => {
  user.tokenValidate = null;
  user.emailValidate = 1;
  user.status = 'active';
  return Users.create(user);
};

service.update = (id, body) => {
  const query = { where: { id } };
  return Users.update(body, query);
};


// Init forgot password process
service.forgot = (identification) => {
  if (!identification) {
    throw new Error('Invalid user identification');
  }

  return Users.findOne({
    where: {
      $or: [{
        username: identification,
      }, {
        email: identification,
      }],
    },
    attributes: ['id', 'username', 'firstName', 'lastName', 'email'],
  })
  .then(User => {
    if (!User) {
      throw new Error('User not registered');
    }

    User.tokenPassRecovery = bcrypt.genSaltSync().replace(/[^a-zA-Z0-9-_]/g, '');

    const expiry = new Date();
    expiry.setHours(expiry.getHours() + 8);
    User.tokenPassRecoveryExpiryDate = expiry;

    return User.save()
      .then(updated => {
        emailService.sendRecoveryEmail(User);

        return {
          msg: `Recovery email sent to ${User.username} (${User.email}).
            Please follow the email instructions to recover your account.`,
        };
      });
  });
};

// Validate reset pasword token
service.validateReset = (token) => {
  return Users.findOne({
    where: {
      tokenPassRecovery: token,
      tokenPassRecoveryExpiryDate: { $gt: new Date() },
    },
    attributes: ['firstName', 'lastName', 'username'],
  }).then(user => {
    if (!user) {
      throw new Error('Invalid/Expired token.');
    }
    return { msg: 'Your password recovery token is valid, please set your new password' };
  });
};

// Do password reset
service.resetPassword = (token, password, verifyPassword) => {
  if (!password || !verifyPassword || password !== verifyPassword) {
    throw new Error('Invalid password');
  }

  return Users.findOne({
    where: {
      tokenPassRecovery: token,
      tokenPassRecoveryExpiryDate: { $gt: new Date() },
    },
  })
  .then(user => {
    if (!user) {
      throw new Error('Invalid or expired token');
    }
    const salt = bcrypt.genSaltSync();

    user.password = bcrypt.hashSync(password, salt);
    user.tokenPassRecovery = null;
    user.tokenPassRecoveryExpiryDate = null;

    // if recovery password then validate user email
    if (user.status === 'not_validated') {
      user.status = 'validated';
      user.tokenValidate = null;
    }

    return user.save()
    .then(updated => {
      return { msg: 'Password successfully changed. Please login again to continue.' };
    });
  });
};

module.exports = service;
