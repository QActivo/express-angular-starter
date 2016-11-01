(function () {
  'use strict';

  angular
    .module('app.signup')
    .controller('SignupValidationController', SignupValidationController);

  SignupValidationController.$inject = ['$state', 'logger', 'authentication'];
  /* @ngInject */
  function SignupValidationController($state, logger, authentication) {
    const vm = this;
    vm.title = 'Email validation';
    vm.user = authentication.getUser();
    vm.resendValidation = resendValidation;
    vm.createAnotherAccount = createAnotherAccount;

    function resendValidation() {
      authentication.sendValidationEmail().then(res => {
        logger.success(res.msg);
      });
    }

    function createAnotherAccount() {
      authentication.clearAll();
      $state.go('signup');
    }
  }
}());
