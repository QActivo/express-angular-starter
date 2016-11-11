(function () {
  'use strict';

  angular
    .module('app.core')
    .filter('notificationAction', notificationAction);

  notificationAction.$inject = ['$sce', '$state', '$httpParamSerializer'];
  /* @ngInject */
  function notificationAction($sce, $state, $httpParamSerializer) {
    return function (notification) {
      let state;
      let params;
      let title;
      switch (notification.action) {
        case 'new_task':
          state = 'task_details';
          params = { taskId: notification.parameters.id };
          title = notification.parameters.title;
          break;
        default:
          title = 'View more';
      }

      if (state && params) {
        const href = $state.href(state, params, { inherit: false });
        const query = $httpParamSerializer({ ref: 'notif', notif_id: notification.id });

        if (notification.status === 'delivered') {
          return $sce.trustAsHtml(`<a href="${href}?${query}">${title}</a>`);
        }
        return $sce.trustAsHtml(`<a href="${href}">${title}</a>`);
      }

      return title;
    };
  }
}());
