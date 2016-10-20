(function () {
  'use strict';

  angular
    .module('app.widgets')
    .directive('htWidgetHeader', htWidgetHeader);

  /* @ngInject */
  function htWidgetHeader() {
    // Usage:
    // <div ht-widget-header title="vm.map.title"></div>
    // Creates:
    // <div ht-widget-header=""
    //      title="Movie"
    //      allow-collapse="true" </div>
    const directive = {
      scope: {
        'title': '@',
        'subtitle': '@',
        'rightText': '@',
        'allowCollapse': '@',
      },
      templateUrl: 'app/widgets/widget-header.html',
      restrict: 'EA',
      link,
    };
    return directive;

    function link(scope, element, attr) {
      scope.toggleContent = function () {
        if (scope.allowCollapse === 'true') {
          const content = angular.element(element).siblings('.widget-content');
          content.toggle();
        }
      };
    }
  }
}());
