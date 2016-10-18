(function () {
  'use strict';

  angular
    .module('app.home')
    .controller('createTaskModalController', createTaskModalController);

  createTaskModalController.$inject = ['$uibModalInstance', 'logger', 'taskservice'];
  /* @ngInject */
  function createTaskModalController($uibModalInstance, logger, taskservice) {
    const vm = this;
    vm.createTask = createTask;
    vm.cancel = cancel;
    vm.task = {};
    activate();

    function activate() {}

    function createTask() {
      return taskservice.createTask(vm.task).then(data => {
        $uibModalInstance.close();
      });
    }

    function cancel() {
      $uibModalInstance.dismiss('cancel');
    }
  }
}());
