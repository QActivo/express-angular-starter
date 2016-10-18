import express from 'express';
import errors from './../error';
import acl from './../config/acl';

import socialService from './../services/social';
import usersService from './../services/users';
import emailService from './../services/email';

/**
 * Users policy
 * ACL configuration
 */
acl.allow([{
  roles: ['user', 'admin'],
  allows: [{
    resources: '/api/v1/users/me',
    permissions: ['get', 'delete'],
  }, {
    resources: '/api/v1/users/me',
    permissions: ['put'],
  }],
},
{
  roles: ['admin'],
  allows: [{
    resources: '/api/v1/users/:userId',
    permissions: ['get', 'put', 'delete'],
  }, {
    resources: '/api/v1/users',
    permissions: ['get', 'post'],
  }],
},
{
  roles: ['guest'],
  allows: [{
    resources: '/api/v1/users/forgot',
    permissions: ['post'],
  },
  {
    resources: '/api/v1/users/validate/:token',
    permissions: ['get'],
  },
  {
    resources: '/api/v1/users/reset/validate/:token',
    permissions: ['get'],
  },
  {
    resources: '/api/v1/users/reset/password/:token',
    permissions: ['post'],
  },
  {
    resources: '/api/v1/users/reset/:token',
    permissions: ['get'],
  }],
}]);

const router = express.Router();

router.get('/api/v1/users', acl.checkRoles, (req, res) => {
  usersService.getAll()
    .then(result => res.json(result))
    .catch(error => {
      res.status(412).json(errors.get(error));
    });
});


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
 * @apiErrorExample {json} Find error
 *    HTTP/1.1 412 Precondition Failed
 */
router.get('/api/v1/users/me', acl.checkRoles, (req, res) => {
  usersService.findById(req.user.id)
    .then(result => res.json(result))
    .catch(error => {
      res.status(412).json(errors.get(error));
    });
});

/**
 * @api {delete} /users/me Deletes an authenticated user
 * @apiGroup User
 * @apiHeader {String} Authorization Token of authenticated user
 * @apiHeaderExample {json} Header
 *    {"Authorization": "JWT xyz.abc.123.hgf"}
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 204 No Content
 * @apiErrorExample {json} Delete error
 *    HTTP/1.1 412 Precondition Failed
 */
router.delete('/api/v1/users/me', acl.checkRoles, (req, res) => {
  usersService.destroy(req.user.id)
    .then(result => res.sendStatus(204))
    .catch(error => {
      res.status(412).json(errors.get(error));
    });
});

/**
 * @api {delete} /users/me Deletes an authenticated user
 * @apiGroup User
 * @apiHeader {String} Authorization Token of authenticated user
 * @apiHeaderExample {json} Header
 *    {"Authorization": "JWT xyz.abc.123.hgf"}
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 204 No Content
 * @apiErrorExample {json} Delete error
 *    HTTP/1.1 412 Precondition Failed
 */
router.delete('/api/v1/users/:userId', acl.checkRoles, (req, res) => {
  usersService.destroy(req.params.userId)
    .then(result => res.json(result))
    .catch(error => {
      res.status(412).json(errors.get(error));
    });
});

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
 * @apiErrorExample {json} Register error
 *    HTTP/1.1 412 Precondition Failed
 */
router.post('/api/v1/users', acl.checkRoles, (req, res) => {
  delete req.body.role;
  usersService.create(req.body)
    .then(result => {
      res.json(result);
    })
    .catch(error => {
      res.status(412).json(errors.get(error));
    });
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
 * @apiErrorExample {json} Register error
 *    HTTP/1.1 412 Precondition Failed
 */
router.put('/api/v1/users/me', acl.checkRoles, (req, res) => {
  delete req.body.role;
  usersService.update(req.user.id, req.body)
    .then(result => res.json(result))
    .catch(error => {
      res.status(412).json(errors.get(error));
    });
});

router.put('/api/v1/users/:userId', acl.checkRoles, (req, res) => {
  usersService.update(req.params.userId, req.body)
    .then(result => res.json(result))
    .catch(error => {
      res.status(412).json(errors.get(error));
    });
});

/**
 * @api {get} /users/validate/:token Validate user email
 * @apiGroup User
 * @apiParam {String} token User tokenValidate
 * @apiSuccess {Number} [1] if is OK
 * @apiErrorExample {json} Find error
 *    HTTP/1.1 412 Precondition Failed
 */
router.get('/api/v1/users/validate/:token', acl.checkRoles, (req, res) => {
  router.services.users.validateEmail(req.params.token)
    .then(result => res.json(result))
    .catch(error => {
      res.status(412).json(errors.get(error));
    });
});

/**
 * @api {post} /users/forgot Send email to recover pass
 * @apiGroup User
 * @apiParam {String} email User email
 * @apiParamExample {json} Input
 *    {
 *      "email": "john@connor.net"
 *    }
 * @apiSuccess {Number} 1 if operation was success
 * @apiErrorExample {json} Register error
 *    HTTP/1.1 412 Precondition Failed
 */
router.post('/api/v1/users/forgot', acl.checkRoles, (req, res) => {
  delete req.body.role;
  usersService.forgot(req.body.email)
    .then(result => {
      emailService.sendRecoveryEmail(req.body.email, result.token);
      res.json(result);
    })
    .catch(error => {
      res.status(412).json(errors.get(error));
    });
});

/**
 * @api {get} /users Validate token to recover pass
 * @apiGroup User
 * @apiParam {String} token to reset pass
 * @apiSuccess {Number} 1 if operation was success
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 200 OK
 *    {
 *      "res": 1,
 *    }
 * @apiErrorExample {json} Register error
 *    HTTP/1.1 412 Precondition Failed
 */
router.get('/api/v1/users/reset/validate/:token', acl.checkRoles, (req, res) => {
  usersService.validateReset(req.params.token)
    .then(result => res.json(result))
    .catch(error => {
      res.status(412).json(errors.get(error));
    });
});

/**
 * @api {post} /users Register a new user
 * @apiGroup User
 * @apiParam {String} token of user
 * @apiParam {String} newPassword
 * @apiParam {String} verifyPassword
 * @apiParamExample {json} Input
 *    {
 *      "token": "abc",
 *      "newPassword": "abc",
 *      "verifyPassword": "abc"
 *    }
 * @apiSuccess {Object} user
 * @apiSuccess {String} token
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 200 OK
 *    {
 *      "res": 1,
 *    }
 * @apiErrorExample {json} Register error
 *    HTTP/1.1 412 Precondition Failed
 */
router.post('/api/v1/users/reset/password/:token', acl.checkRoles, (req, res) => {
  usersService.resetPassword(req.params.token, req.body.newPassword)
    .then(result => res.json(result))
    .catch(error => {
      res.status(412).json(errors.get(error));
    });
});

/**
 * @api {post} /users Register a new user (Facebook)
 * @apiGroup User
 * @apiParam {String} code
 * @apiParam {String} clientId
 * @apiParam {String} redirectUri
 * @apiParamExample {json} Input
 *    {
 *      "code": "abc",
 *      "clientId": "abc",
 *      "redirectUri": "http://redirect"
 *    }
 * @apiSuccess {Object} user
 * @apiSuccess {String} token
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 200 OK
 *    {
 *      "user": { "name" : "John", "id": 1 },
 *      "token": "abczyx"
 *    }
 * @apiErrorExample {json} Register error
 *    HTTP/1.1 412 Precondition Failed
 */
router.post('/api/v1/auth/facebook', acl.checkRoles, (req, res) => {
  socialService.facebook(req.body.code, req.body.clientId,
  req.body.redirectUri)
    .then(result => res.json(result))
    .catch(error => {
      res.status(412).json(errors.get(error));
    });
});

/**
 * @api {post} /users Register a new user (Twitter)
 * @apiGroup User
 * @apiParam {String} code
 * @apiParam {String} clientId
 * @apiParam {String} redirectUri
 * @apiParamExample {json} Input
 *    {
 *      "code": "abc",
 *      "clientId": "abc",
 *      "redirectUri": "http://redirect"
 *    }
 * @apiSuccess {Object} user
 * @apiSuccess {String} token
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 200 OK
 *    {
 *      "user": { "name" : "John", "id": 1 },
 *      "token": "abczyx"
 *    }
 * @apiErrorExample {json} Register error
 *    HTTP/1.1 412 Precondition Failed
 */
router.post('/api/v1/auth/twitter', acl.checkRoles, (req, res) => {
  socialService.twitter(req.body)
    .then(result => res.json(result))
    .catch(error => {
      res.status(412).json(errors.get(error));
    });
});

/**
 * @api {post} /users Register a new user (Instagram)
 * @apiGroup User
 * @apiParam {String} code
 * @apiParam {String} clientId
 * @apiParam {String} redirectUri
 * @apiParamExample {json} Input
 *    {
 *      "code": "abc",
 *      "clientId": "abc",
 *      "redirectUri": "http://redirect"
 *    }
 * @apiSuccess {Object} user
 * @apiSuccess {String} token
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 200 OK
 *    {
 *      "user": { "name" : "John", "id": 1 },
 *      "token": "abczyx"
 *    }
 * @apiErrorExample {json} Register error
 *    HTTP/1.1 412 Precondition Failed
 */
router.post('/api/v1/auth/instagram', acl.checkRoles, (req, res) => {
  socialService.instagram(req.body.code, req.body.clientId,
  req.body.redirectUri)
    .then(result => res.json(result))
    .catch(error => {
      res.status(412).json(errors.get(error));
    });
});

/**
 * @api {post} /users Register a new user (Google)
 * @apiGroup User
 * @apiParam {String} code
 * @apiParam {String} clientId
 * @apiParam {String} redirectUri
 * @apiParamExample {json} Input
 *    {
 *      "code": "abc",
 *      "clientId": "abc",
 *      "redirectUri": "http://redirect"
 *    }
 * @apiSuccess {Object} user
 * @apiSuccess {String} token
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 200 OK
 *    {
 *      "user": { "name" : "John", "id": 1 },
 *      "token": "abczyx"
 *    }
 * @apiErrorExample {json} Register error
 *    HTTP/1.1 412 Precondition Failed
 */
router.post('/api/v1/auth/google', acl.checkRoles, (req, res) => {
  socialService.google(req.body.code, req.body.clientId,
  req.body.redirectUri)
    .then(result => res.json(result))
    .catch(error => {
      res.status(412).json(errors.get(error));
    });
});

/**
 * @api {post} /users Register a new user (Pinterest)
 * @apiGroup User
 * @apiParam {String} code
 * @apiParam {String} clientId
 * @apiParam {String} redirectUri
 * @apiParamExample {json} Input
 *    {
 *      "code": "abc",
 *      "clientId": "abc",
 *      "redirectUri": "http://redirect"
 *    }
 * @apiSuccess {Object} user
 * @apiSuccess {String} token
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 200 OK
 *    {
 *      "user": { "name" : "John", "id": 1 },
 *      "token": "abczyx"
 *    }
 * @apiErrorExample {json} Register error
 *    HTTP/1.1 412 Precondition Failed
 */
router.post('/api/v1/auth/pinterest', acl.checkRoles, (req, res) => {
  socialService.pinterest(req.body.code, req.body.clientId,
  req.body.redirectUri)
    .then(result => res.json(result))
    .catch(error => {
      res.status(412).json(errors.get(error));
    });
});

export default router;
