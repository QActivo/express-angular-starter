import uuid from 'node-uuid';
import Sequelize from 'sequelize';

import config from './../config/config';
import Sessions from './../models/sessions';

const service = {};

/**
 * Find one session by his Authorization token
 * And check session expiration date
 */
service.findSession = (authToken) => {
  const date = new Date().toISOString();
  return Sessions.findOne({
    where: { authToken },
    attributes: [
      'user_id', 'authToken', 'expiresOn', 'issuedOn', 'updatedOn',
      Sequelize.literal(`expiresOn <= '${date}' AS expired`),
    ],
  });
};

/**
 * Find one session by his Authorization token
 * And updates expiration date
 */
service.validateSession = (authToken) => {
  return service.findSession(authToken)
    .then(Session => {
      if (Session && !Session.expired) {
        const expiresOn = new Date();
        expiresOn.setSeconds(expiresOn.getSeconds() + config.sessionExpiration);
        Session.expiresOn = expiresOn;

        return Session.save();
      }
      return Session;
    });
};

/**
 * Remove a user session
 */
service.removeSession = (Session) => {
  return Session.destroy();
};

/**
 * Close all sessions from an user
 */
service.removeAllSessions = (User) => {
  return Sessions.destroy({
    where: { user_id: User.id },
  });
};

/**
 * Remove expired sessions from an user
 */
service.removeExpiredSessions = (User) => {
  return Sessions.destroy({
    where: {
      user_id: User.id,
      expiresOn: { $lt: new Date() },
    },
  });
};

/**
 * Create a new session for a user
 */
service.createNewSession = (User) => {
  const authToken = uuid.v1({ id: User.id });
  const issuedOn = new Date();
  const updatedOn = new Date(issuedOn.getTime());
  const expiresOn = new Date(issuedOn.getTime());
  expiresOn.setSeconds(expiresOn.getSeconds() + config.sessionExpiration);

  return User.createSession({ authToken, issuedOn, updatedOn, expiresOn });
};

module.exports = service;
