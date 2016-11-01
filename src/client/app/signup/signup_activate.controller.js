(function () {
  'use strict';

  angular
    .module('app.signup')
    .controller('SignupActivateController', SignupActivateController);

  SignupActivateController.$inject = ['$state', 'logger', 'authentication'];
  /* @ngInject */
  function SignupActivateController($state, logger, authentication) {
    const vm = this;
    vm.title = 'Signup activate';
    vm.user = authentication.getUser();
    vm.activateProfile = activateProfile;

    function activateProfile() {
      authentication.activateAccount().then(res => {
        logger.success(res.msg);
        $state.go('home');
      });
    }
  }
}());
