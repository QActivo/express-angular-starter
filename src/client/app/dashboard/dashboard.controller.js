(function () {
  'use strict';

  angular
    .module('app.dashboard')
    .controller('DashboardController', DashboardController);

  DashboardController.$inject = ['taskservice', 'usersservice'];
  /* @ngInject */
  function DashboardController(taskservice, usersservice) {
    const vm = this;
    vm.title = 'Dashboard';

    activate();

    function activate() {
      // Get users count
      usersservice.getCount()
        .then(count => {
          vm.userCount = count;
        });

      // Get all task count
      taskservice.getCount()
        .then(count => {
          vm.taskCount = count;
        });


      // Get complete tasks count
      taskservice.getCountDone()
        .then(count => {
          vm.taskDoneCount = count;
        });

      // Get not done tasks count
      taskservice.getCountNotDone()
        .then(count => {
          vm.taskNotDoneCount = count;
        });
    }
  }
}());
