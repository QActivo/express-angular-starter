(function () {
  'use strict';

  angular
    .module('app.users')
    .controller('PasswordResetController', PasswordResetController);

  PasswordResetController.$inject = ['$state', '$stateParams', 'logger', 'authentication'];
  /* @ngInject */
  function PasswordResetController($state, $stateParams, logger, authentication) {
    const vm = this;
    vm.title = 'Password Reset';
    vm.credentials = {
      password: '',
      verifyPassword: '',
    };
    vm.reset = reset;

    activate();

    function activate() {
      if (!$stateParams.tokenId) {
        logger.error('Invalid reset token');
      }
      authentication.token($stateParams.tokenId)
      .then(data => {
        logger.success(data.msg);
      })
      .catch(err => {
        $state.go('login');
      });
    }

    function reset(form) {
      if (form.$valid) {
        authentication.reset($stateParams.tokenId, vm.credentials).then(data => {
          logger.success(data.msg);
          $state.go('login');
        });
      }
    }
  }
}());
