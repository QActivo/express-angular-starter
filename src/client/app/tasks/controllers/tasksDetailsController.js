(function () {
  'use strict';

  angular
    .module('app.tasks')
    .controller('TasksDetailsController', TasksDetailsController);

  TasksDetailsController.$inject = [
    '$stateParams', '$uibModal', 'logger', '$state', 'taskservice', 'alert',
  ];
  /* @ngInject */
  function TasksDetailsController(
    $stateParams, $uibModal, logger, $state, taskservice, alert
  ) {
    const vm = this;
    vm.title = 'Task Detail';
    vm.task = {};
    vm.editTask = showEditTaskModal;
    vm.deleteTask = showDeleteModal;

    activate();

    function activate() {
      loadTask();
    }

    function loadTask() {
      if (!$stateParams.taskId) {
        logger.error('Invalid Task');
        $state.go('tasks');
      }

      return taskservice.getTaskById($stateParams.taskId)
      .then(task => {
        vm.task = task;
      });
    }

    function showDeleteModal() {
      alert.show({
        title: 'Delete task',
        warning: `Delete task ${vm.task.title} permanently?`,
      })
      .then(res => {
        return taskservice.deleteTask(vm.task.id);
      })
      .then(res => {
        logger.success('Task deleted');
        $state.go('tasks');
      });
    }

    function showEditTaskModal() {
      alert.show({
        title: 'Update task',
        warning: 'Save task chenges permanently?',
      })
      .then(res => {
        return taskservice.updateTask(vm.task.id, vm.task);
      })
      .then(res => {
        logger.success('Task Updated');
        $state.go('tasks');
      });
    }
  }
}());
