import express from 'express';
import acl from './../config/acl';
import tokensService from './../services/tokens';


/**
 * Token policy
 * ACL configuration
 */
acl.allow([{
  roles: ['guest', 'user', 'admin'],
  allows: [{
    resources: '/api/v1/token',
    permissions: 'post',
  }],
}]);

const router = express.Router();

/**
 * @api {post} /token Authentication Token
 * @apiGroup Credentials
 * @apiParam {String} email User email
 * @apiParam {String} password User password
 * @apiParamExample {json} Input
 *    {
 *      "email": "john@connor.net",
 *      "password": "123456"
 *    }
 * @apiSuccess {String} token Token of authenticated user
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 200 OK
 *    {"token": "xyz.abc.123.hgf"}
 * @apiErrorExample {json} Authentication error
 *    HTTP/1.1 401 Unauthorized
 */
router.post('/api/v1/token', acl.checkRoles, (req, res) => {
  if (req.body.email && req.body.password) {
    const email = req.body.email;
    const password = req.body.password;
    tokensService.signin(email, password)
      .then(response => res.json(response))
      .catch(error => {
        res.status(401).json({ msg: 'Incorrect Credentials' });
      });
  } else {
    res.status(401).json({ msg: 'Incomplete Credentials' });
  }
});

export default router;
