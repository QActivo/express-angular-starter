import Notifications from './../models/notifications';

const service = {};

service.getAll = function (User, params) {
  const query = {
    where: {
      status: { $ne: 'deleted' },
    },
    order: 'created_at DESC',
  };

  if (params && params.limit) {
    query.limit = parseInt(params.limit, 10);
  }

  return User.getNotifications(query);
};

service.create = function (User, content, action, parameters) {
  return Notifications.create({
    user_id: (typeof User === 'object') ? User.id : User,
    parameters: JSON.stringify(parameters),
    content: JSON.stringify(content),
    action: JSON.stringify(action),
    status: 'delivered',
  })
  .catch(err => {
    // Check error
  });
};

service.markAsRead = function (User, id) {
  return Notifications.update({
    status: 'read',
  }, {
    where: {
      id,
      user_id: User.id,
      status: 'delivered',
    },
  });
};

module.exports = service;
