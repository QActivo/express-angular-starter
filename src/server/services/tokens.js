import jwt from 'jwt-simple';

import config from './../config/config';
import Users from './../models/users';

const service = {};

service.signin = (email, password) => {
  return Users.findOne({ where: { email } })
    .then(user => {
      if (!Users.isPassword(user.password, password)) {
        throw new Error({
          message: 'Invalid Password',
        });
      }
      if (!user.emailValidate) {
        throw new Error({
          message: 'Email Not Validated',
        });
      }

      const payload = { id: user.id };

      return {
        user: {
          id: user.id,
          name: user.name,
          role: user.role,
        },
        token: jwt.encode(payload, config.jwtSecret),
      };
    })
    .catch(error => {
      if (!error.message) {
        error.message = 'Invalid Password';
      }
      throw error;
    });
};

module.exports = service;
