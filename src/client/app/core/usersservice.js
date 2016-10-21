(function () {
  'use strict';

  angular
    .module('app.core')
    .factory('usersservice', usersservice);

  usersservice.$inject = ['$http', '$q', 'exception', 'logger'];
  /* @ngInject */
  function usersservice($http, $q, exception, logger) {
    const service = {
      getUsers,
      createUser,
      editUser,
      removeUser,
      getCount,
    };

    return service;

    function getUsers(params) {
      return $http.get('/api/v1/users', { params })
        .then(success)
        .catch(fail);

      function success(response) {
        return response.data;
      }

      function fail(e) {
        return exception.catcher('XHR Failed for getUsers')(e);
      }
    }

    function createUser(user) {
      return $http.post('/api/v1/users', user)
        .then(success)
        .catch(fail);

      function success(response) {
        return response.data;
      }

      function fail(e) {
        return exception.catcher('XHR Failed for createUser')(e);
      }
    }

    function editUser(user) {
      return $http.put('/api/v1/users/' + user.id, user)
        .then(success)
        .catch(fail);

      function success(response) {
        return response.data;
      }

      function fail(e) {
        return exception.catcher('XHR Failed for editUser')(e);
      }
    }

    function removeUser(id) {
      return $http.delete('/api/v1/users/' + id)
        .then(success)
        .catch(fail);

      function success(response) {
        return response.data;
      }

      function fail(e) {
        return exception.catcher('XHR Failed for remove')(e);
      }
    }

    function getCount(query) {
      const params = {};
      if (query) {
        params.params = query;
      }

      return $http.get('/api/v1/users/count', params)
        .then(success)
        .catch(fail);

      function success(response) {
        return response.data;
      }

      function fail(e) {
        return exception.catcher('XHR Failed for getCount')(e);
      }
    }
  }
}());
