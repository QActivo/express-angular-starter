(function () {
  'use strict';

  angular
    .module('app.users')
    .controller('EditUserModalController', EditUserModalController);

  EditUserModalController.$inject = ['$uibModalInstance', 'usersservice', 'user'];
  /* @ngInject */
  function EditUserModalController($uibModalInstance, usersservice, user) {
    const vm = this;
    vm.roles = ['admin', 'user'];
    vm.user = user;

    vm.save = save;
    vm.cancel = cancel;

    function save() {
      usersservice.editUser(vm.user)
        .then(() => { $uibModalInstance.close(); });
    }

    function cancel() {
      $uibModalInstance.dismiss('cancel');
    }
  }
}());
