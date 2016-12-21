(function () {
  'use strict';

  const core = angular.module('app.core');

  core.config(toastrConfig);

  toastrConfig.$inject = ['toastr'];
  /* @ngInject */
  function toastrConfig(toastr) {
    toastr.options.timeOut = 4000;
    toastr.options.positionClass = 'toast-bottom-right';
  }

  core.config(loadingBarConfig);

  loadingBarConfig.$inject = ['cfpLoadingBarProvider'];
  /* @ngInject */
  function loadingBarConfig(cfpLoadingBarProvider) {
    // cfpLoadingBarProvider.includeSpinner = false;
  }

  const config = {
    appErrorPrefix: '[Mean Relational Error]',
    appTitle: 'Mean Relational',
  };

  core.value('config', config);

  core.config(configure);

  configure.$inject = [
    '$httpProvider', '$logProvider', 'routerHelperProvider', 'exceptionHandlerProvider',
  ];
  /* @ngInject */
  function configure($httpProvider, $logProvider, routerHelperProvider, exceptionHandlerProvider) {
    if ($logProvider.debugEnabled) {
      $logProvider.debugEnabled(true);
    }
    exceptionHandlerProvider.configure(config.appErrorPrefix);
    routerHelperProvider.configure({ docTitle: config.appTitle + ': ' });
    $httpProvider.interceptors.push('RequestInterceptor');
  }

  core.config(filePickerConfig);

  filePickerConfig.$inject = ['filepickerProvider'];
  /* @ngInject */
  function filePickerConfig(filepickerProvider) {
    filepickerProvider.setKey('AFOad6qXmRXCJ7qZt0tMez');
  }
}());
