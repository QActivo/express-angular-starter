(function () {
  'use strict';

  angular
    .module('app.tasks')
    .run(appRun);

  appRun.$inject = ['routerHelper'];
  /* @ngInject */
  function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return [
      {
        state: 'tasks',
        config: {
          url: '/tasks?userId?status',
          templateUrl: 'app/tasks/templates/tasksList.html',
          controller: 'TasksController',
          controllerAs: 'tc',
          title: 'Tasks',
          settings: {
            nav: 0,
            content: 'Tasks',
            roles: ['user', 'admin'],
          },
        },
      },
    ];
  }
}());
