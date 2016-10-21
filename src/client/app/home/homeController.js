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
    vm.pagination = {
      filter: '',
      page: 1,
      lengthMenu: [10, 25, 50, 100],
      limit: 10,
    };
    vm.changeLimit = changeLimit;
    vm.changePage = changePage;
    vm.loadTasks = loadTasks;

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

    function changePage() {
      return loadTasks(vm.pagination.page);
    }

    function changeLimit() {
      return loadTasks();
    }

    function loadTasks(page = 1) {
      const params = {};
      vm.pagination.page = page;

      params.page = vm.pagination.page;
      params.limit = vm.pagination.limit;
      params.filter = (vm.pagination.filter !== '') ? vm.pagination.filter : null;

      taskservice.getTasks(params)
        .then((tasks) => {
          vm.tasks = tasks.rows;
          vm.count = tasks.count;
        });
    }
  }
}());
