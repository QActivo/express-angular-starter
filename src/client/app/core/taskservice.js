(function () {
  'use strict';

  angular
    .module('app.core')
    .factory('taskservice', taskservice);

  taskservice.$inject = ['$http', '$q', 'exception', 'logger'];
  /* @ngInject */
  function taskservice($http, $q, exception, logger) {
    const service = {
      createTask,
      updateTask,
      getTasks,
      getMessageCount,
      getCount,
      getCountDone,
      getCountNotDone,
    };

    return service;

    function getMessageCount() { return $q.when(72); }

    function getTasks(params) {
      return $http.get('/api/v1/tasks', { params })
        .then(success)
        .catch(fail);

      function success(response) {
        return response.data;
      }

      function fail(e) {
        return exception.catcher('XHR Failed for getTasks')(e);
      }
    }
    
    function createTask(task) {
      return $http.post('/api/v1/tasks', task)
        .then(success)
        .catch(fail);

      function success(response) {
        return response.data;
      }

      function fail(e) {
        return exception.catcher('XHR Failed for createTask')(e);
      }
    }

    function updateTask(taskId, task) {
      return $http.put('/api/v1/tasks/' + taskId, task)
        .then(success)
        .catch(fail);

      function success(response) {
        return response.data;
      }

      function fail(e) {
        return exception.catcher('XHR Failed for updateTask')(e);
      }
    }
  }
}());
