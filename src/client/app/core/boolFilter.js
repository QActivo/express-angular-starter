(function () {
  'use strict';

  angular
    .module('app.core')
    .filter('boolFilter', boolFilter);

  function boolFilter($sce) {
    return function (input) {
      let output = $sce.trustAsHtml('<button class="btn btn-success">'
        + '<span class="glyphicon glyphicon-ok" aria-hidden="true"></span></button>');
      if (input === false) {
        output = $sce.trustAsHtml('<button class="btn btn-danger">'
          + '<span class="glyphicon glyphicon-remove" aria-hidden="true"></span></button>');
      }
      return output;
    };
  }
}());
