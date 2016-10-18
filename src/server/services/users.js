import bcrypt from 'bcrypt';

import Users from './../models/users';

const service = {};

service.getAll = () => {
  return Users.findAll({
    attributes: ['id', 'name', 'email', 'role'],
  });
};

service.findById = (id) => {
  return Users.findById(id, {
    attributes: ['id', 'name', 'email', 'role'],
  });
};

service.destroy = (id) => {
  return Users.destroy({
    where: { id },
  });
};

service.create = (user) => {
  user.tokenValidate = null;
  user.emailValidate = 1;
  return Users.create(user);
};

service.update = (id, body) => {
  const query = { where: { id } };

  return Users.update(body, query);
};

service.validateEmail = (token) => {
  const query = { where: { tokenValidate: token } };
  const value = { emailValidate: 1, tokenValidate: null };
  return Users.update(value, query);
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
