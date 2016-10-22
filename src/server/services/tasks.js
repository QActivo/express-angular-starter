import Tasks from './../models/tasks';

import Paginator from './../classes/paginator';

const service = {};

service.getAll = (user, params) => {
  const paginator = new Paginator(Tasks);
  return paginator.getPaginated({
    attributes: ['id', 'title', 'done'],
    scope: { user_id: user.id },
    filter: params.filter,
    filterAttributes: ['title'],
    page: params.page,
    limit: params.limit,
  });
};

service.create = (task) => {
  return Tasks.create(task);
};

service.findById = (id, user) => {
  const query = { where: { id } };

  if (user) {
    query.where.user_id = user.id;
  }

  return Tasks.findOne(query);
};

service.update = (id, task, user) => {
  const query = { where: { id } };

  if (user) {
    query.where.user_id = user.id;
  }

  return Tasks.update(task, query);
};

service.destroy = (id, user) => {
  const query = { where: { id } };

  if (user) {
    query.where.user_id = user.id;
  }

  return Tasks.destroy(query);
};

module.exports = service;
