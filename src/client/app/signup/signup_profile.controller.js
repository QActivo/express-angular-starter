(function () {
  'use strict';

  angular
    .module('app.signup')
    .controller('SignupProfileController', SignupProfileController);

  SignupProfileController.$inject = ['$state', 'logger', 'authentication'];
  /* @ngInject */
  function SignupProfileController($state, logger, authentication) {
    const vm = this;
    vm.title = 'Signup profile';
    vm.user = authentication.getUser();
    vm.saveProfile = saveProfile;
    vm.profile = {
      firstName: '',
      lastName: '',
      password: '',
      verifyPassword: '',
    };

    function saveProfile(form) {
      if (form.$valid) {
        authentication.storeProfile(vm.profile).then(res => {
          logger.success(res.msg);
          $state.go('signup_activate');
        });
      }
    }
  }
}());
