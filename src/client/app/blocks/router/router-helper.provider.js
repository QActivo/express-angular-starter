/* Help configure the state-base ui.router */
(function () {
  'use strict';

  angular
    .module('blocks.router')
    .provider('routerHelper', routerHelperProvider);

  routerHelperProvider.$inject = ['$locationProvider', '$stateProvider', '$urlRouterProvider'];
  /* @ngInject */
  function routerHelperProvider($locationProvider, $stateProvider, $urlRouterProvider) {
    /* jshint validthis:true */
    const config = {
      docTitle: undefined,
      resolveAlways: {},
    };

    if (!(window.history && window.history.pushState)) {
      window.location.hash = '/';
    }

    $locationProvider.html5Mode(true);

    this.configure = function (cfg) {
      angular.extend(config, cfg);
    };

    this.$get = RouterHelper;
    RouterHelper.$inject = ['$location', '$rootScope', '$state', 'logger', 'authentication'];
    /* @ngInject */
    function RouterHelper($location, $rootScope, $state, logger, authentication) {
      let handlingStateChangeError = false;
      let hasOtherwise = false;
      const stateCounts = {
        errors: 0,
        changes: 0,
      };

      const service = {
        configureStates,
        getStates,
        stateCounts,
      };

      init();

      return service;

      // /////////////

      function configureStates(states, otherwisePath) {
        states.forEach(function (state) {
          state.config.resolve = angular.extend(state.config.resolve || {}, config.resolveAlways);
          $stateProvider.state(state.state, state.config);
        });

        if (otherwisePath && !hasOtherwise) {
          hasOtherwise = true;
          $urlRouterProvider.otherwise(otherwisePath);
        }
      }

      function handleRoutingPermissions() {
        $rootScope.$on('$stateChangeStart', checkPermissions);

        function checkPermissions(event, toState, toParams, fromState, fromParams) {
          let allowed = false;

          if (toState.settings && toState.settings.roles && toState.settings.roles.length > 0) {
            const authenticated = typeof authentication.getUser() === 'object';
            const role = authentication.getUser() ? authentication.getUser().role : 'guest';
            const status = authentication.getUser() ? authentication.getUser().status : 'any';

            if (toState.settings.roles && role) {
              allowed = toState.settings.roles.indexOf(role) !== -1;
            }

            if (toState.settings.status && status) {
              allowed = toState.settings.status.indexOf(status) !== -1;
            }

            if (!toState.settings.status && status !== 'active' && authenticated) {
              allowed = false;
            }

            if (!allowed) {
              console.log(authentication.continueFrom());
              event.preventDefault();
              $state.go(authentication.continueFrom());
            }
          }
        }
      }

      // Route cancellation:
      // On routing error, go to the dashboard.
      // Provide an exit clause if it tries to do it twice.
      function handleRoutingErrors() {
        $rootScope.$on('$stateChangeError', handleErrors);

        function handleErrors(event, toState, toParams, fromState, fromParams, error) {
          if (handlingStateChangeError) {
            return;
          }

          stateCounts.errors++;
          handlingStateChangeError = true;

          const destination = (toState &&
            (toState.title || toState.name || toState.loadedTemplateUrl)) || 'unknown target';

          const msg = 'Error routing to ' + destination + '. ' +
            (error.data || '') + '. <br/>' + (error.statusText || '') + ': ' + (error.status || '');

          logger.warning(msg, [toState]);
          $location.path('/');
        }
      }

      function init() {
        handleRoutingPermissions();
        handleRoutingErrors();
        updateDocTitle();
      }

      function getStates() {
        return $state.get();
      }

      function updateDocTitle() {
        $rootScope.$on('$stateChangeSuccess', updateTitle);

        function updateTitle(event, toState, toParams, fromState, fromParams) {
          stateCounts.changes++;
          handlingStateChangeError = false;
          const title = config.docTitle + ' ' + (toState.title || '');
          $rootScope.title = title; // data bind to <title>
        }
      }
    }
  }
}());
