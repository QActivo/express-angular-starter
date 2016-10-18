(function () {
  'use strict';

  angular
    .module('app.login')
    .controller('LogoutController', LogoutController);

  LogoutController.$inject = ['logger', 'authentication'];
  /* @ngInject */
  function LogoutController(logger, authentication) {
    activate();

    function activate() {
      authentication.logout();
    }
  }
}());
