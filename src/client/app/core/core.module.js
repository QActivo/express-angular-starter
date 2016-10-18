(function () {
  'use strict';

  angular
    .module('app.core', [
      'ngAnimate', 'ngSanitize',
      'ngStorage',
      'blocks.exception', 'blocks.logger', 'blocks.router',
      'ui.router',
      'chart.js',
      'ui.router', 'angular-loading-bar', 'wysiwyg.module',
      'angular-filepicker',
    ]);
}());
