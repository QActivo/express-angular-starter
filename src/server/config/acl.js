import ACL from 'acl';

let acl = null;

if (!acl) {
  acl = new ACL(new ACL.memoryBackend());
}

acl.checkRoles = (req, res, next) => {
  const roles = (req.user) ? [req.user.role] : ['guest'];
  // Check for user roles
  acl
    .areAnyRolesAllowed(roles, req.route.path, req.method.toLowerCase(), (err, isAllowed) => {
      if (err) {
        // An authorization error occurred.
        res.status(500).json({
          msg: 'Unexpected authorization error',
        });
      } else {
        if (isAllowed) {
          // Access granted! Invoke next middleware
          next();
        } else {
          res.status(403).json({
            msg: 'User is not authorized',
          });
        }
      }
    });
};

module.exports = acl;
