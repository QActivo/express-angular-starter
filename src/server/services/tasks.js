import Tasks from './../models/tasks';

const service = {};

service.getAll = (user) => {
  return Tasks.findAll({
    where: { user_id: user.id },
  });
};

service.getPaginated = (user, params) => {
  const query = {};
  query.where = { user_id: user.id };
  buildPagination(params, query);
  return Tasks.findAndCountAll(query);
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

function buildPagination(params, query) {
  query.limit = 10;
  query.offset = 0;

  if (params.offset) {
    query.offset = parseInt(params.offset, 10) * parseInt(params.limit, 10);
  }

  if (params.limit) {
    query.limit = parseInt(params.limit, 10);
  }
}

module.exports = service;
