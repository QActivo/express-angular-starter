import ACL from 'acl';

let acl = null;

if (!acl) {
  acl = new ACL(new ACL.memoryBackend());
}

acl.checkRoles = (req, res, next) => {
  const roles = (req.User) ? [req.User.role] : ['guest'];
  // Check for user roles
  acl.areAnyRolesAllowed(roles, req.route.path, req.method.toLowerCase(), (err, isAllowed) => {
    if (err) { // An authorization error occurred.
      res.status(500).json({ msg: 'Unexpected authorization error' });
    } else {
      if (isAllowed) {
        if (req.Session && req.Session.expired) {
          res.status(401).json({ msg: 'User session has expired' });
        } else {
          next(); // Access granted! Invoke next middleware
        }
      } else {
        res.status(403).json({ msg: 'User is not authorized' });
      }
    }
  });
};

module.exports = acl;
