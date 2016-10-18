(function () {
  'use strict';

  angular
    .module('app.home')
    .controller('editTaskModalController', editTaskModalController);

  editTaskModalController.$inject = ['$uibModalInstance', 'logger', 'taskservice', 'task'];
  /* @ngInject */
  function editTaskModalController($uibModalInstance, logger, taskservice, task) {
    const vm = this;
    vm.createTask = createTask;
    vm.cancel = cancel;
    vm.task = task;
    activate();

    function activate() {}

    function createTask() {
      return taskservice.updateTask(vm.task.id, vm.task).then(data => {
        $uibModalInstance.close();
      });
    }

    function cancel() {
      $uibModalInstance.dismiss('cancel');
    }
  }
}());
