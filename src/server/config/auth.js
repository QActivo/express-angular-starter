import passport from 'passport';
import { Strategy, ExtractJwt } from 'passport-jwt';

import config from './config';
import sessionsService from './../services/sessions';


const params = {
  secretOrKey: config.jwtSecret,
  jwtFromRequest: ExtractJwt.fromAuthHeader(),
};

const strategy = new Strategy(params, (payload, done) => {
  sessionsService.validateSession(payload)
  .then(Session => {
    if (!Session) {
      return done(null, false);
    }

    return Session.getUser()
    .then(User => {
      if (!User) {
        return done(null, false);
      }

      return done(null, { User, Session });
    });
  })
  .catch(error => {
    done(error, null);
  });
});

passport.use(strategy);

export default class Auth {
  static initialize() {
    return passport.initialize();
  }

  static authenticate(cb) {
    return passport.authenticate('jwt', config.jwtSession, cb);
  }
}
