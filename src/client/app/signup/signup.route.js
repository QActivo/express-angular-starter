(function () {
  'use strict';

  angular
    .module('app.signup')
    .run(appRun);

  appRun.$inject = ['routerHelper'];
  /* @ngInject */
  function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return [
      {
        state: 'signup',
        config: {
          url: '/signup',
          templateUrl: 'app/signup/templates/signup.html',
          controller: 'SignupController',
          controllerAs: 'vm',
          title: 'Signup',
          settings: {
            nav: 0,
            content: '<i class="fa fa-lock"></i> Login',
            roles: ['guest'],
          },
        },
      },
      {
        state: 'signup_validation',
        config: {
          url: '/signup/validation',
          templateUrl: 'app/signup/templates/signup_validation.html',
          controller: 'SignupValidationController',
          controllerAs: 'vm',
          title: 'Email validation',
          settings: {
            nav: 0,
            content: '<i class="fa fa-lock"></i> Login',
            roles: ['user'],
            status: ['not_validated'],
          },
        },
      },
      {
        state: 'signup_validation_process',
        config: {
          url: '/signup/validation/:tokenValidate',
          templateUrl: 'app/signup/templates/signup_validation_process.html',
          controller: 'SignupValidationEmailController',
          controllerAs: 'vm',
          title: 'Email validation',
          settings: {
            nav: 0,
            content: '<i class="fa fa-lock"></i> Login',
            roles: ['user', 'guest'],
            status: ['not_validated', 'any'],
          },
        },
      },
      {
        state: 'signup_profile',
        config: {
          url: '/signup/profile',
          templateUrl: 'app/signup/templates/signup_profile.html',
          controller: 'SignupProfileController',
          controllerAs: 'vm',
          title: 'Signup profile',
          settings: {
            nav: 0,
            content: '<i class="fa fa-lock"></i> Login',
            roles: ['user'],
            status: ['validated'],
          },
        },
      },
      {
        state: 'signup_activate',
        config: {
          url: '/signup/activate',
          templateUrl: 'app/signup/templates/signup_activate.html',
          controller: 'SignupActivateController',
          controllerAs: 'vm',
          title: 'Signup activate',
          settings: {
            nav: 0,
            content: '<i class="fa fa-lock"></i> Login',
            roles: ['user'],
            status: ['not_active'],
          },
        },
      },
    ];
  }
}());
