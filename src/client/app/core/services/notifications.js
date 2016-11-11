(function () {
  'use strict';

  angular
    .module('app.core')
    .service('Notifications', Notifications);

  Notifications.$inject = ['$q', '$http'];
  /* @ngInject */
  function Notifications($q, $http) {
    const service = {
      getAll,
      markAsRead,
      notifications: [],
    };
    const all = $q.defer();

    return service;

    function getAll(params) {
      return $http.get('/api/v1/notifications', { params })
        .then(success);

      function success(response) {
        service.notifications = response.data;
        all.resolve();
        return service.notifications;
      }
    }

    function markAsRead(id) {
      const which = parseInt(id, 10);
      all.promise.then(() => {
        const notif = service.notifications.find(item => {
          return item.id === which;
        });

        if (notif) {
          $http.put(`/api/v1/notifications/${which}`).then(() => {
            notif.status = 'read';
          });
        }
      });
    }
  }
}());
