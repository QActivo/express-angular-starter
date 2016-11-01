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
      clearAll,
      //
      updateHeader,
      removeHeader,
      //
      login,
      logout,
      //
      signup,
      sendValidationEmail,
      validateEmail,
      storeProfile,
      activateAccount,
      //
      forgot,
      reset,
      token,
      //
      continueFrom,
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

    function clearAll() {
      clearUser();
      clearSession();
      removeHeader();
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

    /**
     * Do user logout, remove current session
     */
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
      return $http.post('/api/v1/signup', credentials)
        .then(response => {
          setUser(response.data.User);
          setSession(response.data.Session);
          updateHeader();

          return response.data;
        })
        .catch(err => {
          return exception.catcher('Failed signup')(err);
        });
    }

    /**
     * Send user validation email again
     */
    function sendValidationEmail() {
      return $http.get('/api/v1/signup/validation')
        .then(response => {
          return response.data;
        })
        .catch(err => {
          return exception.catcher('Failed send validation email')(err);
        });
    }

    /**
     * Validate user email
     */
    function validateEmail(key) {
      return $http.get('/api/v1/signup/validate/' + key)
        .then(response => {
          setUser(response.data.User);
          setSession(response.data.Session);
          updateHeader();

          return response.data;
        })
        .catch(err => {
          return exception.catcher('Failed validate email')(err);
        });
    }

    /**
     * Store user profile after email validation
     */
    function storeProfile(profile) {
      return $http.post('/api/v1/signup/profile', profile)
        .then(response => {
          setUser(response.data.User);
          setSession(response.data.Session);
          updateHeader();

          return response.data;
        })
        .catch(err => {
          return exception.catcher('Failed store profile')(err);
        });
    }

    /**
     * Finish signup process and activate user account
     */
    function activateAccount() {
      return $http.post('/api/v1/signup/activate')
      .then(response => {
        setUser(response.data.User);
        setSession(response.data.Session);
        updateHeader();

        return response.data;
      })
      .catch(err => {
        return exception.catcher('Failed activate account')(err);
      });
    }

    /**
     * Password forgot/recovery
     * param credentials : object {email: example@domain.name}
     */
    function forgot(credentials) {
      return $http.post('/api/v1/users/forgot', credentials);
    }

    /**
     * Password reset
     * param token: password reset token
     * param credentials: object {password: password}
     */
    function reset(paramToken, credentials) {
      return $http.post('/api/v1/users/reset/password/' + paramToken, credentials);
    }

    /**
     * Password reset token validation
     * param token: token to validate
     */
    function token(paramToken) {
      return $http.get('/api/v1/users/reset/validate/' + paramToken);
    }

    /**
     *
     */
    function continueFrom() {
      if (!service.user) {
        return 'login';
      }

      const states = {
        'not_validated': 'signup_validation',
        'validated': 'signup_profile',
        'active': 'dashboard',
      };
      return states[service.user.status] || 'home';
    }
  }
}());
