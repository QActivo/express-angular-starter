import express from 'express';
import errors from './../error';
import acl from './../config/acl';
import notificationsService from './../services/notifications';

/**
 * Notifications policy
 * ACL configuration
 */
acl.allow([{
  roles: ['admin', 'user'],
  allows: [{
    resources: '/api/v1/notifications',
    permissions: ['get'],
  }, {
    resources: '/api/v1/notifications/:id',
    permissions: ['put'],
  }],
}]);

const router = express.Router();

router.get('/api/v1/notifications', acl.checkRoles, (req, res) => {
  notificationsService.getAll(req.User, req.query)
    .then(result => res.json(result))
    .catch(error => res.status(412).json(errors.get(error)));
});

router.put('/api/v1/notifications/:id', acl.checkRoles, (req, res) => {
  notificationsService.markAsRead(req.User, req.params.id)
    .then(result => res.json(result))
    .catch(error => res.status(412).json(errors.get(error)));
});

export default router;
