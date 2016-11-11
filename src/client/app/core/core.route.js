(function () {
  'use strict';

  angular
    .module('app.core')
    .run(appRun);

  /* @ngInject */
  function appRun(routerHelper) {
    const otherwise = '/404';
    routerHelper.configureStates(getStates(), otherwise);
  }

  firstPage.$inject = ['$timeout', '$state', 'authentication'];
  /* @ngInject */
  function firstPage($timeout, $state, authentication) {
    const user = authentication.getUser();
    const role = user ? user.role : 'guest';
    const states = {
      'user': 'tasks',
      'admin': 'dashboard',
      'guest': 'login',
    };

    $timeout(() => {
      $state.go(states[role]);
    }, 0);
  }

  function showNotification($window, $stateParams, $timeout) {
    console.log($stateParams.redirect);
    $window.location.href = $stateParams.redirect;
    $timeout(() => {
    }, 0);
  }

  function getStates() {
    return [
      {
        state: 'default',
        config: {
          url: '/',
          resolve: { firstPage },
        },
      },
      {
        state: 'notifications',
        config: {
          url: '/notification/:id?:state&:redirect',
          resolve: { showNotification },
        },
      },
      {
        state: '404',
        config: {
          url: '/404',
          templateUrl: 'app/core/templates/404.html',
          title: '404',
          roles: ['guest', 'user', 'admin'],
        },
        settings: {
          roles: ['guest', 'user', 'admin'],
        },
      },
    ];
  }
}());
