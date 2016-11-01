(function () {
  'use strict';

  angular
    .module('app.signup')
    .controller('SignupValidationEmailController', SignupValidationEmailController);

  SignupValidationEmailController.$inject = ['$state', '$stateParams', 'logger', 'authentication'];
  /* @ngInject */
  function SignupValidationEmailController($state, $stateParams, logger, authentication) {
    const vm = this;
    vm.title = 'Email validation';
    vm.user = authentication.getUser();

    activate();

    function activate() {
      if ($stateParams.tokenValidate) {
        authentication.validateEmail($stateParams.tokenValidate).then(res => {
          logger.success(res.msg);
          $state.go('signup_profile');
        });
      }
    }
  }
}());
