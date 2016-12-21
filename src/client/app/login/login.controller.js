(function () {
  'use strict';

  angular
    .module('app.login')
    .controller('LoginController', LoginController);

  LoginController.$inject = ['logger', 'authentication'];
  /* @ngInject */
  function LoginController(logger, authentication) {
    const vm = this;
    vm.title = 'Login';
    vm.credentials = {
      identification: '',
      password: '',
    };
    vm.login = login;

    activate();

    function activate() {}

    function login(form) {
      if (form.$valid) {
        authentication.login(vm.credentials).then(data => {
          logger.success(`Welcome ${data.firstName} ${data.lastName}!`);
        });
      }
    }
  }
}());
