(function () {
  'use strict';

  angular
    .module('app.core')
    .factory('reportservice', reportservice);

  reportservice.$inject = ['$http', '$q', 'exception', 'logger'];
  /* @ngInject */
  function reportservice($http, $q, exception, logger) {
    const service = {
      findAll,
      getForGraph,
      create,
      bulkCreate,
      update,
      findOne,
      findOnePopulated,
      findAllPaginated,
    };

    return service;

    function findAll(query) {
      const params = {};

      if (query) {
        params.params = query;
      }

      return $http.get('/api/v1/reports', params)
        .then(success)
        .catch(fail);

      function success(response) {
        return response.data;
      }

      function fail(e) {
        return exception.catcher('XHR Failed for findAll')(e);
      }
    }

    function findAllPaginated(query) {
      const params = {};

      if (query) {
        params.params = query;
      }

      return $http.get('/api/v1/reports/paginated', params)
        .then(success)
        .catch(fail);

      function success(response) {
        return response.data;
      }

      function fail(e) {
        return exception.catcher('XHR Failed for findAllPaginated')(e);
      }
    }

    function findOne(reportId) {
      return $http.get('/api/v1/reports/' + reportId)
        .then(success)
        .catch(fail);

      function success(response) {
        return response.data;
      }

      function fail(e) {
        return exception.catcher('XHR Failed for findOne')(e);
      }
    }

    function findOnePopulated(reportId) {
      return $http.get('/api/v1/reports/' + reportId + '/populated')
        .then(success)
        .catch(fail);

      function success(response) {
        return response.data;
      }

      function fail(e) {
        return exception.catcher('XHR Failed for findOnePopulated')(e);
      }
    }

    function getForGraph(query) {
      const params = {};
      if (query) {
        params.params = query;
      }

      return $http.get('/api/v1/reports/forGraph', params)
        .then(success)
        .catch(fail);

      function success(response) {
        return response.data;
      }

      function fail(e) {
        return exception.catcher('XHR Failed for getForGraph')(e);
      }
    }

    function create(report) {
      return $http.post('/api/v1/reports', report)
        .then(success)
        .catch(fail);

      function success(response) {
        return response.data;
      }

      function fail(e) {
        return exception.catcher('XHR Failed for create')(e);
      }
    }

    function bulkCreate(reportList) {
      return $http.post('/api/v1/reports/bulk', reportList)
        .then(success)
        .catch(fail);

      function success(response) {
        return response.data;
      }

      function fail(e) {
        return exception.catcher('XHR Failed for bulkCreate')(e);
      }
    }

    function update(reportId, report) {
      return $http.put('/api/v1/reports/' + reportId, report)
        .then(success)
        .catch(fail);

      function success(response) {
        return response.data;
      }

      function fail(e) {
        return exception.catcher('XHR Failed for create')(e);
      }
    }
  }
}());
