import usersService from './../services/users';
import sessionsService from './../services/sessions';

const service = {};

/**
 * Do user signin, store new session for the logged user
 * with Authorization token and expiration date
 */
service.signin = (credentials) => {
  if (!credentials || !credentials.identification || !credentials.password) {
    throw new Error('Incomplete Credentials');
  }

  const where = {
    $or: [{
      username: credentials.identification,
    }, {
      email: credentials.identification,
    }],
  };

  return usersService.findUser(where, true)
  .then(User => {
    if (!User || !User.isPassword(credentials.password)) {
      throw new Error('Invalid Username or Password');
    }

    return sessionsService.removeExpiredSessions(User)
    .then(() => {
      return sessionsService.createNewSession(User);
    })
    .then(Session => {
      return { User, Session };
    });
  });
};

/**
 * Do user signout, remove current user session from storage
 */
service.signout = (Session) => {
  return sessionsService.removeSession(Session)
  .then(() => {
    return { msg: 'Signout Successfully' };
  });
};

/**
 * Finish all user sessions
 */
service.endSessions = (User) => {
  return sessionsService.removeAllSessions(User)
  .then(() => {
    return { msg: 'Sessions closed' };
  });
};

module.exports = service;
