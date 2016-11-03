import express from 'express';
import errors from './../error';
import acl from './../config/acl';

import usersService from './../services/users';

/**
 * Users policy
 * ACL configuration
 */
acl.allow([
  {
    roles: ['user', 'admin'],
    allows: [{
      resources: '/api/v1/users/me',
      permissions: ['get'],
    }, {
      resources: '/api/v1/users/update',
      permissions: ['put'],
    }, {
      resources: '/api/v1/users/updatepassword',
      permissions: ['put'],
    }],
  }, {
    roles: ['admin'],
    allows: [{
      resources: '/api/v1/users',
      permissions: ['get', 'post'],
    }, {
      resources: '/api/v1/users/count',
      permissions: ['get'],
    }, {
      resources: '/api/v1/users/:userId',
      permissions: ['get', 'put', 'delete'],
    }],
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/v1/users/forgot',
      permissions: ['post'],
    }, {
      resources: '/api/v1/users/reset/validate/:token',
      permissions: ['get'],
    }, {
      resources: '/api/v1/users/reset/password/:token',
      permissions: ['post'],
    }],
  },
]);

const router = express.Router();

/**
 * @api {get} /users/me Return the authenticated user's data
 * @apiGroup User
 * @apiHeader {String} Authorization Token of authenticated user
 * @apiHeaderExample {json} Header
 *    {"Authorization": "JWT xyz.abc.123.hgf"}
 * @apiSuccess {Number} id User id
 * @apiSuccess {String} name User name
 * @apiSuccess {String} email User email
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 200 OK
 *    {
 *      "id": 1,
 *      "name": "John Connor",
 *      "email": "john@connor.net"
 *    }
 * @apiErrorExample {json} Error
 *    HTTP/1.1 412 Precondition Failed
 *    {
 *      "msg": "Not allowed or invalid user",
 *    }
 */
router.get('/api/v1/users/me', acl.checkRoles, (req, res) => {
  res.json(req.user);
});

/**
 * @api {put} /users Edit a user
 * @apiGroup User
 * @apiParam {String} name User name
 * @apiParam {String} email User email
 * @apiParamExample {json} Input
 *    {
 *      "name": "John Connor",
 *      "email": "john@connor.net",
 *      "id": 1
 *    }
 * @apiSuccess {Number} id User id
 * @apiParam {String} name User name
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 200 OK
 *    {
 *      "id": 1,
 *      "email": "john@connor.net",
 *      "name": "John Connor"
 *    }
 * @apiErrorExample {json} Error
 *    HTTP/1.1 412 Precondition Failed
 *    {
 *      "msg": "Not allowed or invalid fields",
 *    }
 */
router.put('/api/v1/users/update', acl.checkRoles, (req, res) => {
  usersService.edit(req.user, req.body)
    .then(result => res.json(result))
    .catch(error => res.status(412).json(errors.get(error)));
});

/**
 * Update User password
 */
router.put('/api/v1/users/updatepassword', acl.checkRoles, (req, res) => {
  try {
    usersService.editPassword(req.user, req.body)
    .then(result => res.json(result))
    .catch(error => res.status(412).json(errors.get(error)));
  } catch (error) {
    res.status(412).json(errors.get(error));
  }
});

/**
 * @api {post} /users/forgot Send email to recover pass
 * @apiGroup User
 * @apiParam {String} email User email
 * @apiParamExample {json} Input
 *    {
 *      "email": "john@connor.net"
 *    }
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
router.post('/api/v1/users/forgot', acl.checkRoles, (req, res) => {
  try {
    usersService.forgot(req.body.identification)
      .then(result => res.json(result))
      .catch(error => res.status(412).json(errors.get(error)));
  } catch (error) {
    res.status(412).json(errors.get(error));
  }
});

/**
 * @api {get} /users/reset/validate/:token Validate token to recover pass
 * @apiGroup User
 * @apiParam {String} token to reset pass
 * @apiSuccess {Number} 1 if operation was success
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
router.get('/api/v1/users/reset/validate/:token', acl.checkRoles, (req, res) => {
  usersService.validateReset(req.params.token)
    .then(result => res.json(result))
    .catch(error => res.status(412).json(errors.get(error)));
});

/**
 * @api {post} /users/reset/password/:token Reset User Password by Reset Token
 * @apiGroup User
 * @apiParam {String} token of user
 * @apiParam {String} newPassword
 * @apiParamExample {json} Input
 *    {
 *      "token": "abc",
 *      "newPassword": "abc",
 *    }
 * @apiSuccess {String} res
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 200 OK
 *    {
 *      "res": 1,
 *    }
 * @apiErrorExample {json} Error invalid token or password
 *    HTTP/1.1 412 Precondition Failed
 *    {
 *      "msg": "Invalid token",
 *    }
 */
router.post('/api/v1/users/reset/password/:token', acl.checkRoles, (req, res) => {
  try {
    usersService.resetPassword(req.params.token, req.body.password, req.body.verifyPassword)
    .then(result => res.json(result))
    .catch(error => res.status(412).json(errors.get(error)));
  } catch (error) {
    res.status(412).json(errors.get(error));
  }
});

/**
 * Admin
 */

router.get('/api/v1/users', acl.checkRoles, (req, res) => {
  usersService.getAll(req.query)
    .then(result => res.json(result))
    .catch(error => res.status(412).json(errors.get(error)));
});

router.get('/api/v1/users/count', acl.checkRoles, (req, res) => {
  usersService.getCount(req.query)
    .then(result => res.json(result))
    .catch(error => res.status(412).json(errors.get(error)));
});

router.delete('/api/v1/users/:userId', acl.checkRoles, (req, res) => {
  usersService.destroy(req.params.userId)
    .then(result => res.json(result))
    .catch(error => res.status(412).json(errors.get(error)));
});

router.post('/api/v1/users', acl.checkRoles, (req, res) => {
  delete req.body.role;
  usersService.create(req.body)
    .then(result => res.json(result))
    .catch(error => res.status(412).json(errors.get(error)));
});

router.put('/api/v1/users/:userId', acl.checkRoles, (req, res) => {
  usersService.update(req.params.userId, req.body)
    .then(result => res.json(result))
    .catch(error => res.status(412).json(errors.get(error)));
});

export default router;
