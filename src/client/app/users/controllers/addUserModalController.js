(function () {
  'use strict';

  angular
    .module('app.users')
    .controller('AddUserModalController', AddUserModalController);

  AddUserModalController.$inject = ['$uibModalInstance', 'usersservice'];
  /* @ngInject */
  function AddUserModalController($uibModalInstance, usersservice) {
    const vm = this;
    vm.roles = ['admin', 'user'];
    vm.user = {
      name: '',
      role: 'admin',
    };
    vm.save = save;
    vm.cancel = cancel;

    function save() {
      usersservice.createUser(vm.user)
        .then(() => { $uibModalInstance.close(); });
    }

    function cancel() {
      $uibModalInstance.dismiss('cancel');
    }
  }
}());
