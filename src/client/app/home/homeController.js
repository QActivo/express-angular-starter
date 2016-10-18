(function () {
  'use strict';

  angular
    .module('app.home')
    .controller('HomeController', HomeController);

  HomeController.$inject = ['$uibModal', 'logger', 'authentication', 'taskservice'];
  /* @ngInject */
  function HomeController($uibModal, logger, authentication, taskservice) {
    const vm = this;
    vm.user = authentication.user;
    vm.title = 'Home';
    vm.tasks = [];
    vm.showModal = showModal;
    vm.showEditTaskModal = showEditTaskModal;

    activate();

    function activate() {
      loadTasks();
    }

    function showModal() {
      const modalInstance = $uibModal.open({
        templateUrl: 'app/home/createTaskModal.html',
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
        templateUrl: 'app/home/editTaskModal.html',
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
      taskservice.getTasks()
        .then((tasks) => {
          vm.tasks = tasks;
        });
    }
  }
}());
