(function () {
  'use strict';
  /*
  This directive allows us to pass a function in on an enter key to do what we want.
   */
  angular
    .module('app.core')
    .directive('ngEnter', ngEnter);

  function ngEnter() {
    return function (scope, element, attrs) {
      element.bind('keydown keypress', (event) => {
        if (event.which === 13) {
          scope.$apply(() => {
            scope.$eval(attrs.ngEnter);
          });
          event.preventDefault();
        }
      });
    };
  }
}());
