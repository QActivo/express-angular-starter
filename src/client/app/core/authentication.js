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
      session: $localStorage.session,
      //
      getUser,
      setUser,
      clearUser,
      //
      getSession,
      setSession,
      clearSession,
      //
      updateHeader,
      removeHeader,
      //
      login,
      logout,
      signup,
    };

    updateHeader();

    return service;

    // implementations
    function getUser() {
      return service.user;
    }

    function setUser(user) {
      service.user = user;
      $localStorage.user = user;
    }

    function clearUser() {
      service.user = undefined;
      delete $localStorage.user;
    }

    function getSession() {
      return service.session;
    }

    function setSession(session) {
      service.session = session;
      $localStorage.session = session;
    }

    function clearSession() {
      service.session = undefined;
      delete $localStorage.session;
    }

    function updateHeader() {
      if ($localStorage.session) {
        $http.defaults.headers.common.Authorization = 'JWT ' + $localStorage.session.authToken;
      }
    }

    function removeHeader() {
      $http.defaults.headers.common.Authorization = undefined;
    }

    /**
     * @param credentials: {email: user_email, password: user_password}
     */
    function login(credentials) {
      return $http.post('/api/v1/signin', credentials)
        .then(response => {
          setUser(response.data.User);
          setSession(response.data.Session);
          updateHeader();

          $rootScope.$broadcast('user-login', service.user);

          if (service.user.role === 'admin') {
            $state.go('dashboard');
          } else {
            $state.go('home');
          }

          return service.user;
        })
        .catch(err => {
          return exception.catcher('Failed Login')(err);
        });
    }

    function logout() {
      return $http.post('/api/v1/signout')
        .then(response => {
          clearUser();
          clearSession();
          removeHeader();

          $rootScope.$broadcast('user-logout');

          // $state.go('login');
        })
        .catch(err => {
          return exception.catcher('Failed Login')(err);
        });
    }

    /**
     * @param credentials: {firstName, lastName, email, password, ...}
     */
    function signup(credentials) {
      return $http.post('/api/v1/users', credentials)
        .then(response => {
          return response;
        })
        .catch(err => {
          return exception.catcher('Failed signup')(err);
        });
    }
  }
}());
