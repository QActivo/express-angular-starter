(function () {
  'use strict';

  angular
    .module('app.core')
    .factory('alert', alert);

  alert.$inject = ['$uibModal'];
  /* @ngInject */
  function alert($uibModal) {
    const service = {
      show,
    };

    return service;

    function show(options) {
      const modalInstance = $uibModal.open({
        templateUrl: 'app/core/alert.html',
        controller: 'AlertController',
        controllerAs: 'ac',
        animation: true,
        resolve: {
          options: () => {
            return options;
          },
        },
      });

      return modalInstance.result;
    }
  }
}());
