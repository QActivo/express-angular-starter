import express from 'express';
import acl from './../config/acl';
import coreService from './../services/core';

/**
 * Core policy
 * ACL configuration
 */
acl.allow([{
  roles: ['guest', 'user'],
  allows: [{
    resources: '/api/v1',
    permissions: '*',
  }],
}]);

const router = express.Router();

/**
 * @api {get} / API Status
 * @apiGroup Status
 * @apiSuccess {String} status API Status' message
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 200 OK
 *    {"status": "mean API"}
 */
router.get('/api/v1', acl.checkRoles, (req, res) => {
  coreService.getIndexMessage()
    .then((status) => res.json(status))
    .catch((error) => res.json(error));
});

export default router;
