(function () {
  'use strict';

  angular
    .module('app.core')
    .filter('unreadNotifications', unreadNotifications);

  unreadNotifications.$inject = [];
  /* @ngInject */
  function unreadNotifications() {
    return function (notifications) {
      const count = notifications.filter(item => { return item.status === 'delivered'; }).length;

      return `<span class="fa-stack fa-sm">
        <i class="fa fa-circle fa-stack-2x text-${(count > 0) ? 'danger' : 'muted'}"></i>
        <i class="fa fa-inverse fa-stack-1x">${count}</i>
      </span>`;
    };
  }
}());
