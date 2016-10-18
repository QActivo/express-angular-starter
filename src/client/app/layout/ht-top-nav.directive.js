(function () {
  'use strict';

  angular
    .module('app.layout')
    .directive('htTopNav', htTopNav);

  /* @ngInject */
  function htTopNav() {
    const directive = {
      bindToController: true,
      controller: TopNavController,
      controllerAs: 'vm',
      restrict: 'EA',
      scope: {
        'navline': '=',
      },
      templateUrl: 'app/layout/ht-top-nav.html',
    };

    TopNavController.$inject = [];

    /* @ngInject */
    function TopNavController() {
    }

    return directive;
  }
}());
