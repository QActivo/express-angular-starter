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
      email: '',
      password: '',
    };
    vm.login = login;

    activate();

    function activate() {}

    function login(form) {
      if (form.$invalid) {
        return null;
      }

      return authentication.login(vm.credentials).then(function (data) {
        logger.success('Welcome ' + data.name + '!');
      });
    }
  }
}());
