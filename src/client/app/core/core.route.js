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

  function getStates() {
    return [
      {
        state: '404',
        config: {
          url: '/404',
          templateUrl: 'app/core/404.html',
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
