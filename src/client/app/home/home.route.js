(function () {
  'use strict';

  angular
    .module('app.home')
    .run(appRun);

  appRun.$inject = ['routerHelper'];
  /* @ngInject */
  function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return [
      {
        state: 'home',
        config: {
          url: '/',
          templateUrl: 'app/home/home.html',
          controller: 'HomeController',
          controllerAs: 'hc',
          title: 'Home',
          settings: {
            nav: 0,
            content: 'Home',
            roles: ['user', 'admin'],
          },
        },
      },
    ];
  }
}());
