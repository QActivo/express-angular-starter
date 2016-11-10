const service = {};

service.getAll = function (User) {
  return User.getNotifications({
    where: {
      status: { $ne: 'deleted' },
    },
  });
};

module.exports = service;
