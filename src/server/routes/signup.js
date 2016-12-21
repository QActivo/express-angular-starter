import express from 'express';
import jwt from 'jwt-simple';

import errors from './../error';
import acl from './../config/acl';
import config from './../config/config';
import signupService from './../services/signup';

/**
 * Users policy
 * ACL configuration
 */
acl.allow([
  {
    roles: ['guest'],
    allows: [{
      resources: '/api/v1/signup',
      permissions: ['post'],
    }],
  }, {
    roles: ['user', 'guest'],
    allows: [{
      resources: '/api/v1/signup/validate/:token',
      permissions: ['get'],
    }],
  }, {
    roles: ['user'],
    allows: [{
      resources: '/api/v1/signup/activate',
      permissions: ['post'],
    }, {
      resources: '/api/v1/signup/profile',
      permissions: ['post'],
    }, {
      resources: '/api/v1/signup/validation',
      permissions: ['get'],
    }],
  },
]);

const router = express.Router();

/**
 * @api {post} /users Register a new user
 * @apiGroup User
 * @apiParam {String} name User name
 * @apiParam {String} email User email
 * @apiParam {String} password User password
 * @apiParamExample {json} Input
 *    {
 *      "name": "John Connor",
 *      "email": "john@connor.net",
 *      "password": "123456"
 *    }
 * @apiSuccess {Number} id User id
 * @apiSuccess {String} name User name
 * @apiSuccess {String} email User email
 * @apiSuccess {String} password User encrypted password
 * @apiSuccess {Date} updated_at Update's date
 * @apiSuccess {Date} created_at Register's date
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 200 OK
 *    {
 *      "id": 1,
 *      "name": "John Connor",
 *      "email": "john@connor.net",
 *      "password": "$2a$10$SK1B1",
 *      "updated_at": "2016-02-10T15:20:11.700Z",
 *      "created_at": "2016-02-10T15:29:11.700Z",
 *    }
 * @apiErrorExample {json} Error
 *    HTTP/1.1 412 Precondition Failed
 *    {
 *      "msg": "Not allowed or invalid fields",
 *    }
 */
router.post('/api/v1/signup', acl.checkRoles, (req, res) => {
  signupService.create(req.body)
    .then(result => {
      res.setHeader('Authorization', jwt.encode(result.Session.authToken, config.jwtSecret));
      res.setHeader('AuthExpiration', result.Session.expiresOn);
      res.json(result);
    })
    .catch(error => res.status(412).json(errors.get(error)));
});

/**
 * @api {get} /users/validate/validation?email=user@email.com Send user validation email
 * @apiGroup User
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 200 OK
 *    {
 *      "res": true,
 *    }
 * @apiErrorExample {json} Error
 *    HTTP/1.1 412 Precondition Failed
 *    {
 *      "msg": "Invalid user email",
 *    }
 */
router.get('/api/v1/signup/validation', acl.checkRoles, (req, res) => {
  signupService.sendValidationEmail(req.User)
    .then(result => res.json(result))
    .catch(error => res.status(412).json(errors.get(error)));
});

/**
 * @api {get} /users/validate/:token Validate user email
 * @apiGroup User
 * @apiParam {String} token User tokenValidate
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 200 OK
 *    {
 *      "res": true,
 *    }
 * @apiErrorExample {json} Error
 *    HTTP/1.1 412 Precondition Failed
 *    {
 *      "msg": "Invalid token",
 *    }
 */
router.get('/api/v1/signup/validate/:token', acl.checkRoles, (req, res) => {
  signupService.validateEmail(req.User, req.Session, req.params.token)
    .then(result => {
      res.setHeader('Authorization', jwt.encode(result.Session.authToken, config.jwtSecret));
      res.setHeader('AuthExpiration', result.Session.expiresOn);
      res.json(result);
    })
    .catch(error => res.status(412).json(errors.get(error)));
});

/**
 * Update user profile, continues signup process
 */
router.post('/api/v1/signup/profile', acl.checkRoles, (req, res) => {
  signupService.storeProfile(req.User, req.Session, req.body)
    .then(result => res.json(result))
    .catch(error => res.status(412).json(errors.get(error)));
});

/**
 * Activate user profile, continues signup process
 */
router.post('/api/v1/signup/activate', acl.checkRoles, (req, res) => {
  signupService.activate(req.User, req.Session)
    .then(result => res.json(result))
    .catch(error => res.status(412).json(errors.get(error)));
});

export default router;
