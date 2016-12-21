(function () {
  'use strict';

  angular
    .module('app.users')
    .run(appRun);

  appRun.$inject = ['routerHelper'];
  /* @ngInject */
  function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return [
      {
        state: 'users',
        config: {
          url: '/users',
          templateUrl: 'app/users/templates/usersList.html',
          controller: 'UserListController',
          controllerAs: 'uc',
          title: 'Users',
          settings: {
            nav: 2,
            content: 'Users',
            roles: ['admin'],
          },
        },
      },
      {
        state: 'password_recovery',
        config: {
          url: '/password_recovery',
          templateUrl: 'app/users/templates/password_recovery.html',
          controller: 'PasswordRecoveryController',
          controllerAs: 'prc',
          title: 'User password recovery',
          settings: {
            nav: 2,
            content: 'Users',
            roles: ['guest'],
          },
        },
      },
      {
        state: 'password_reset',
        config: {
          url: '/password_reset/:tokenId',
          templateUrl: 'app/users/templates/password_reset.html',
          controller: 'PasswordResetController',
          controllerAs: 'prc',
          title: 'User password recovery',
          settings: {
            nav: 2,
            content: 'Users',
            roles: ['guest'],
          },
        },
      },
    ];
  }
}());
