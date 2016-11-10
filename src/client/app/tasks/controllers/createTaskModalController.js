(function () {
  'use strict';

  angular
    .module('app.tasks')
    .controller('createTaskModalController', createTaskModalController);

  createTaskModalController.$inject = [
    '$stateParams', '$uibModalInstance', 'logger', 'taskservice',
  ];
  /* @ngInject */
  function createTaskModalController($stateParams, $uibModalInstance, logger, taskservice) {
    const vm = this;
    vm.createTask = createTask;
    vm.cancel = cancel;
    vm.task = {
      user_id: $stateParams.userId,
    };

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
