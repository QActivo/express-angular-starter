(function () {
  'use strict';

  angular
    .module('app.users')
    .controller('UserListController', UserListController);

  UserListController.$inject = ['$state', '$stateParams', '$uibModal',
    'logger', 'alert', 'usersservice', 'authentication'];

  /* @ngInject */
  function UserListController($state, $stateParams, $uibModal,
    logger, alert, usersservice, authentication) {
    const vm = this;
    vm.title = 'Users';
    vm.currentUser = authentication.user;
    vm.users = [];
    vm.openAddUserModal = openAddUserModal;
    vm.openEditUserModal = openEditUserModal;
    vm.removeUser = removeUser;
    vm.pagination = {
      filter: '',
      page: 1,
      lengthMenu: [10, 25, 50, 100],
      limit: 10,
    };
    vm.changeLimit = changeLimit;
    vm.changePage = changePage;
    vm.loadUsers = loadUsers;

    activate();

    function activate() {
      loadUsers();
    }

    function openAddUserModal() {
      const modalInstance = $uibModal.open({
        templateUrl: 'app/users/addUserModal.html',
        controller: 'AddUserModalController',
        controllerAs: 'uc',
        resolve: {
        },
      });

      modalInstance.result
        .then(loadUsers)
        .then((res) => {
          logger.success('User created');
        });
    }

    function openEditUserModal(user) {
      const modalInstance = $uibModal.open({
        templateUrl: 'app/users/editUserModal.html',
        controller: 'EditUserModalController',
        controllerAs: 'uc',
        resolve: {
          user: angular.copy(user),
        },
      });

      modalInstance.result
        .then(loadUsers)
        .then((res) => {
          logger.success('User edited');
        });
    }

    function removeUser(user) {
      const opts = {
        title: 'Remove User',
        body: 'Are you sure you want to delete this User?',
      };

      alert.show(opts)
        .then(accept)
        .then(loadUsers)
        .then((res) => {
          logger.success('User deleted.');
        });

      function accept() {
        return usersservice.removeUser(user.id);
      }
    }

    function changePage() {
      return loadUsers(vm.pagination.page);
    }

    function changeLimit() {
      return loadUsers();
    }

    function loadUsers(page = 1) {
      const params = {};
      vm.pagination.page = page;

      params.page = vm.pagination.page;
      params.limit = vm.pagination.limit;
      params.filter = (vm.pagination.filter !== '') ? vm.pagination.filter : null;

      return usersservice.getUsers(params)
        .then(users => {
          vm.users = users.rows;
          vm.count = users.count;
        });
    }
  }
}());
