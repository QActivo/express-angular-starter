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
          templateUrl: 'app/users/usersList.html',
          controller: 'UserListController',
          controllerAs: 'uc',
          title: 'Users',
          settings: {
            nav: 1,
            content: 'Users',
            roles: ['admin'],
          },
        },
      },
    ];
  }
}());
