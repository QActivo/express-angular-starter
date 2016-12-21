(function () {
  'use strict';

  angular
    .module('app.signup')
    .controller('SignupController', SignupController);

  SignupController.$inject = ['logger', 'authentication', '$state'];
  /* @ngInject */
  function SignupController(logger, authentication, $state) {
    const vm = this;
    vm.title = 'Login';
    vm.credentials = {
      email: '',
      username: '',
    };
    vm.signup = signup;

    activate();

    function activate() {}

    function signup(form) {
      if (form.$valid) {
        authentication.signup(vm.credentials).then(res => {
          logger.success(res.msg);
          $state.go(authentication.continueFrom());
        });
      }
    }
  }
}());
