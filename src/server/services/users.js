import bcrypt from 'bcrypt-nodejs';

import Users from './../models/users';

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
    'picture', 'tokenValidate', 'tokenPassRecovery', 'tokenPassRecoveryDate', 'status',
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

service.forgot = (email) => {
  const query = { where: { email } };
  const user = {};
  user.tokenPassRecovery = bcrypt.genSaltSync().replace(/[^a-zA-Z0-9-_]/g, '');
  user.tokenPassRecoveryDate = new Date();
  return Users.update(user, query).then((res) => {
    if (res[0] === 0) {
      return { errorMessage: 'User not registered.' };
    }
    return {
      token: user.tokenPassRecovery,
    };
  });
};

service.validateReset = (token) => {
  const query = { where: { tokenPassRecovery: token } };

  function diffDates(date1, date2) {
    const timeDiff = Math.abs(date2.getTime() - date1.getTime());
    const diffHours = Math.ceil(timeDiff / (1000 * 3600));
    return diffHours;
  }

  return Users.findOne(query).then((data) => {
    if (diffDates(data.tokenPassRecoveryDate, new Date()) > 8) {
      return { 'res': 0 };
    }
    return { 'res': 1 };
  });
};

service.resetPassword = (token, newPassword) => {
  const salt = bcrypt.genSaltSync();
  const pass = bcrypt.hashSync(newPassword, salt);
  const query = { where: { tokenPassRecovery: token } };
  const value = {
    password: pass,
    tokenPassRecovery: null,
  };

  return Users.update(value, query).then((data) => {
    if (data[0]) {
      return { 'res': 1 };
    }
    return { 'res': 0 };
  });
};

module.exports = service;
