(function () {
  'use strict';

  angular
    .module('app.login')
    .run(appRun);

  appRun.$inject = ['routerHelper'];
  /* @ngInject */
  function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return [
      {
        state: 'login',
        config: {
          url: '/login',
          templateUrl: 'app/login/login.html',
          controller: 'LoginController',
          controllerAs: 'vm',
          title: 'Login',
          settings: {
            nav: 0,
            content: '<i class="fa fa-lock"></i> Login',
            roles: ['guest'],
          },
        },
      },
      {
        state: 'logout',
        config: {
          url: '/logout',
          controller: 'LogoutController',
          settings: {
            nav: 0,
            content: '<i class="fa fa-lock"></i> Logout',
            roles: ['user', 'admin'],
          },
        },
      },
    ];
  }
}());
