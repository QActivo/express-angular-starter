import express from 'express';
import errors from './../error';
import acl from './../config/acl';

import socialService from './../services/social';

/**
 * Users policy
 * ACL configuration
 */
acl.allow([]);

const router = express.Router();

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
  socialService.facebook(req.body.code, req.body.clientId, req.body.redirectUri)
    .then(result => res.json(result))
    .catch(error => res.status(412).json(errors.get(error)));
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
    .catch(error => res.status(412).json(errors.get(error)));
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
  socialService.instagram(req.body.code, req.body.clientId, req.body.redirectUri)
    .then(result => res.json(result))
    .catch(error => res.status(412).json(errors.get(error)));
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
  socialService.google(req.body.code, req.body.clientId, req.body.redirectUri)
    .then(result => res.json(result))
    .catch(error => res.status(412).json(errors.get(error)));
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
  socialService.pinterest(req.body.code, req.body.clientId, req.body.redirectUri)
    .then(result => res.json(result))
    .catch(error => res.status(412).json(errors.get(error)));
});

export default router;
