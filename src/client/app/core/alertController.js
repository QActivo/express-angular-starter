(function () {
  'use strict';

  angular
    .module('app.home')
    .controller('AlertController', AlertController);

  AlertController.$inject = ['$uibModalInstance', 'options'];
  /* @ngInject */
  function AlertController($uibModalInstance, options) {
    const vm = this;
    vm.options = {
      title: 'Alert',
      body: 'Are you sure?',
      warning: null,
    };

    vm.accept = accept;
    vm.cancel = cancel;

    activate();

    function activate() {
      if (options) {
        if (options.title) {
          vm.options.title = options.title;
        }

        if (options.body) {
          vm.options.body = options.body;
        }

        if (options.warning) {
          vm.options.warning = options.warning;
        }
      }
    }

    function accept() {
      $uibModalInstance.close();
    }

    function cancel() {
      $uibModalInstance.dismiss('cancel');
    }
  }
}());
