import passport from 'passport';
import { Strategy, ExtractJwt } from 'passport-jwt';

import config from './config';
import Users from './../models/users';


const params = {
  secretOrKey: config.jwtSecret,
  jwtFromRequest: ExtractJwt.fromAuthHeader(),
};

const strategy = new Strategy(params, (payload, done) => {
  Users.findById(payload.id)
    .then(user => {
      if (user) {
        return done(null, {
          id: user.id,
          email: user.email,
          role: user.role,
        });
      }
      return done(null, false);
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
