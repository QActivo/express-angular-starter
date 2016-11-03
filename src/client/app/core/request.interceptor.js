(function () {
  'use strict';

  angular
    .module('app.core')
    .factory('RequestInterceptor', RequestInterceptor);


  RequestInterceptor.$inject = ['$q', '$injector', '$rootScope', '$localStorage', '$timeout'];
  /* @ngInject */
  function RequestInterceptor($q, $injector, $rootScope, $localStorage, $timeout) {
    return {
      response: (response) => {
        const exp = response.headers().AuthExpiration;
        if (exp && $localStorage.session) {
          $localStorage.session.expiresOn = exp; // In Universal Time
        }
        return response;
      },
      responseError: (rejection) => {
        if (!rejection.config.ignoreAuthModule) {
          switch (rejection.status) {
            case 401: // User session has expired (Unauthorized)
              // Clear Authorization token
              $injector.get('authentication').clearAll();

              // Go to login
              $timeout(() => { $injector.get('$state').transitionTo('login'); }, 0);
              break;
            case 403: // User not authorized for this request (Forbidden)
              break;
            case 503: // Nothing special, no connection to internet
              break;
            default:
              break;
          }
        }
        // otherwise, default behaviour
        return $q.reject(rejection);
      },
      request: ($config) => {
        // Check Authorization Token
        // if ($localStorage.session) {
        //   // Check Authorization Expiration
        //   const expiresOn = $localStorage.session.expiresOn;
        //   if (expiresOn && $config.url.includes('/api/v1/')) {
        //     const nowUTC = new Date().toUTCString();
        //     const exp = moment(expiresOn, 'YYYY-MM-DDTHH:mm:ss.SSS', false).utc();
        //     const now = moment(nowUTC, 'ddd, DD MMM YYYY HH:mm:ss.SSSS GMT', false).utc();
        //
        //     if (!exp.isAfter(now)) {
        //       $config.status = 401; // Not Authorized session expired
        //       $config.config = { ignoreAuthModule: false };
        //       $config.data = { msg: 'Your Session has expired' };
        //       return $q.reject($config);
        //     }
        //   }
        // }

        return $config;
      },
    };
  }
}());
