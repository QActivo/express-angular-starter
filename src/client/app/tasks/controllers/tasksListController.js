(function () {
  'use strict';

  angular
    .module('app.tasks')
    .controller('TasksController', TasksController);

  TasksController.$inject = [
    '$stateParams', '$uibModal', 'logger', 'authentication', 'taskservice', 'alert',
  ];
  /* @ngInject */
  function TasksController($stateParams, $uibModal, logger, authentication, taskservice, alert) {
    const vm = this;
    vm.user = authentication.user;
    vm.title = 'Home';
    vm.tasks = [];
    vm.createTask = showCreateModal;
    vm.editTask = showEditTaskModal;
    vm.deleteTask = showDeleteModal;

    activate();

    function activate() {
      loadTasks();
    }

    function showDeleteModal(task) {
      alert.show({
        title: 'Delete task',
        warning: `Delete task ${task.title} permanently?`,
      })
      .then(res => {
        return taskservice.deleteTask(task.id);
      })
      .then(res => {
        logger.success('Task deleted');
        loadTasks();
      });
    }

    function showCreateModal() {
      const modalInstance = $uibModal.open({
        templateUrl: 'app/tasks/templates/createTaskModal.html',
        controller: 'createTaskModalController',
        controllerAs: 'ctmc',
        resolve: {
          taskservice: () => {
            return taskservice;
          },
          logger: () => {
            return logger;
          },
        },
      });

      modalInstance.result
        .then(success);

      function success() {
        logger.success('Task created');
        loadTasks();
      }
    }

    function showEditTaskModal(task) {
      const modalInstance = $uibModal.open({
        templateUrl: 'app/tasks/templates/editTaskModal.html',
        controller: 'editTaskModalController',
        controllerAs: 'etmc',
        resolve: {
          taskservice: () => {
            return taskservice;
          },
          logger: () => {
            return logger;
          },
          task: () => {
            return task;
          },
        },
      });

      modalInstance.result
        .then(success);

      function success() {
        logger.success('Task edited');
        loadTasks();
      }
    }

    function loadTasks() {
      return taskservice.getTasks({ userId: $stateParams.userId, status: $stateParams.status })
      .then(tasks => {
        vm.tasks = tasks;
      });
    }
  }
}());
