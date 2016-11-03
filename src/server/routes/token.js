import express from 'express';
import jwt from 'jwt-simple';
import errors from './../error';
import acl from './../config/acl';
import tokenService from './../services/tokens';
import config from './../config/config';

/**
 * Token policy
 * ACL configuration
 */
acl.allow([{
  roles: ['guest'],
  allows: [{
    resources: '/api/v1/signin',
    permissions: 'post',
  }],
}, {
  roles: ['admin', 'user'],
  allows: [{
    resources: '/api/v1/signout',
    permissions: 'post',
  }, {
    resources: '/api/v1/signout/all',
    permissions: 'post',
  }],
}]);

const router = express.Router();

router.post('/api/v1/signin', acl.checkRoles, (req, res) => {
  try {
    tokenService.signin(req.body)
      .then(response => {
        res.setHeader('Authorization', jwt.encode(response.Session.authToken, config.jwtSecret));
        res.setHeader('AuthExpiration', response.Session.expiresOn);
        res.json(response);
      })
      .catch(error => res.status(412).json(errors.get(error)));
  } catch (error) {
    res.status(412).json(errors.get(error));
  }
});

router.post('/api/v1/signout', acl.checkRoles, (req, res) => {
  tokenService.signout(req.Session)
    .then(response => {
      res.removeHeader('Authorization');
      res.removeHeader('AuthExpiration');
      res.json(response);
    })
    .catch(error => res.status(412).json(errors.get(error)));
});

router.post('/api/v1/signout/all', acl.checkRoles, (req, res) => {
  tokenService.endSessions(req.User)
    .then(response => {
      res.removeHeader('Authorization');
      res.removeHeader('AuthExpiration');
      res.json(response);
    })
    .catch(error => res.status(412).json(errors.get(error)));
});

export default router;
