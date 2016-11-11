import Tasks from './../models/tasks';
import Notifications from './../services/notifications';

const service = {};

service.getAll = (User, params) => {
  if (User.role !== 'admin') {
    delete params.userId;
  }

  const query = {
    where: { user_id: params.userId || User.id },
  };

  const status = {
    completed: true,
    incompleted: false,
  };

  if (params.status && status[params.status]) {
    query.where.done = status[params.status];
  }

  return Tasks.findAll(query);
};

service.getPaginated = (user, params) => {
  const query = {};
  query.where = { user_id: user.id };
  buildPagination(params, query);
  return Tasks.findAndCountAll(query);
};

service.getCount = (User, params) => {
  if (User.role !== 'admin') {
    delete params.userId;
  }

  const query = {
    where: { user_id: params.userId || User.id },
  };

  if (params && params.done) {
    query.where.done = (params.done === 'true');
  }

  return Tasks.count(query);
};

service.create = (User, task) => {
  if (!User.role === 'admin' && task.user_id) {
    delete task.user_id;
  }

  if (!task.user_id) {
    task.user_id = User.id;
  }

  return Tasks.create(task)
    .then(Task => {
      if (task.user_id !== User.id) {
        // Send new task notification to remote user
        Notifications.create(
          task.user_id, `The user ${User.firstName} ${User.lastName} created a new task for you`,
          'new_task', { id: Task.id, title: Task.title }
        );
      }
      return Task;
    });
};

service.findById = (id, user) => {
  const query = { where: { id } };

  if (user) {
    query.where.user_id = user.id;
  }

  return Tasks.findOne(query);
};

service.update = (id, task, User) => {
  const query = { where: { id } };
  delete task.id;
  delete task.user_id;

  if (User.role !== 'admin') {
    query.where.user_id = User.id;
  }

  return Tasks.update(task, query);
};

service.destroy = (id, User) => {
  const query = { where: { id } };

  if (User.role !== 'admin') {
    query.where.user_id = User.id;
  }

  return Tasks.destroy(query)
    .then(res => {
      if (res === 0) {
        throw new Error('Can\'t delete task/invalid task');
      }
    });
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
