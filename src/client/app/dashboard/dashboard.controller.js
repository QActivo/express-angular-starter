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
      taskservice.getCount({done: true})
        .then(count => {
          vm.taskDoneCount = count;
        });

      // Get not done tasks count
      taskservice.getCount({done: false})
        .then(count => {
          vm.taskNotDoneCount = count;
        });
    }
  }
}());
