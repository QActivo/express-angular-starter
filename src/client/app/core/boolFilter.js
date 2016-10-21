(function () {
  'use strict';

  angular
    .module('app.core')
    .filter('boolFilter', boolFilter);

  function boolFilter($sce) {
    return function (input) {
      let output = $sce.trustAsHtml('<button class="btn btn-success">'
        + '<i class="fa fa-check-circle"></i></span></button>');
      if (input === false) {
        output = $sce.trustAsHtml('<button class="btn btn-danger">'
          + '<i class="fa fa-clock-o"></i></span></button>');
      }
      return output;
    };
  }
}());
