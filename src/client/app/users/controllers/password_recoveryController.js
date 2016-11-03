(function () {
  'use strict';

  angular
    .module('app.users')
    .controller('PasswordRecoveryController', PasswordRecoveryController);

  PasswordRecoveryController.$inject = ['$state', 'logger', 'authentication'];
  /* @ngInject */
  function PasswordRecoveryController($state, logger, authentication) {
    const vm = this;
    vm.title = 'Password Recovery';
    vm.credentials = {
      identification: '',
    };
    vm.recover = recover;

    function recover(form) {
      if (form.$valid) {
        authentication.forgot(vm.credentials).then(data => {
          logger.success(data.msg);
          $state.go('login');
        });
      }
    }
  }
}());
