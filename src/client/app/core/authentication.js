(function () {
  'use strict';

  angular
    .module('app.core')
    .factory('authentication', authentication);

  authentication.$inject = ['$rootScope', '$http', '$q',
    '$state', '$localStorage', 'exception', 'logger'];
  /* @ngInject */
  function authentication($rootScope, $http, $q,
    $state, $localStorage, exception, logger) {
    const service = {
      user: $localStorage.user,
      getUser,
      login,
      logout,
      signup,
    };

    updateHeader();

    return service;

    // implementations

    function updateHeader() {
      // Update previous headers
      if ($localStorage.token) {
        // Set default headers
        $http.defaults.headers.common.Authorization = 'JWT ' + $localStorage.token;
      }
    }

    function removeHeader() {
      // Update previous headers
      $http.defaults.headers.common.Authorization = undefined;
    }

    function getUser() {
      return service.user;
    }

    /**
     * @param credentials: {email: user_email, password: user_password}
     */
    function login(credentials) {
      return $http.post('/api/v1/token', credentials)
        .then(loginCompleted)
        .catch(loginFailed);

      function loginCompleted(response) {
        service.user = response.data.user;
        $localStorage.user = response.data.user;
        $localStorage.token = response.data.token;
        updateHeader();
        // broadcast user logged message and user data
        $rootScope.$broadcast('user-login', response.data.user);
        if (response.data.user.role === 'admin') {
          $state.go('dashboard');
        } else {
          $state.go('home');
        }

        return response.data.user;
      }

      function loginFailed(err) {
        return exception.catcher('Failed Login')(err);
      }
    }

    function logout() {
      service.user = null;
      delete $localStorage.user;
      delete $localStorage.token;

      removeHeader();

      // broadcast user logout message
      $rootScope.$broadcast('user-logout');

      $state.go('login');
    }

    /**
     * @param credentials: {firstName, lastName, email, password, ...}
     */
    function signup(credentials) {
      return $http.post('/api/v1/users', credentials)
        .then(signupCompleted)
        .catch(signupFailed);

      function signupCompleted(response) {
        return response;
      }

      function signupFailed(err) {
        return exception.catcher('Failed signup')(err);
      }
    }
  }
}());
