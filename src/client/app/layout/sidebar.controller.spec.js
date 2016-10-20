/* eslint no-undef: 0*/

describe('layout', () => {
  describe('sidebar', () => {
    let controller;

    beforeEach(() => {
      module('app.layout', bard.fakeToastr);
      bard.inject('$controller', '$httpBackend', '$location',
        '$rootScope', '$state', 'routerHelper');
    });

    beforeEach(() => {
      routerHelper.configureStates(mockData.getMockStates(), '/');
      const scope = $rootScope.$new();
      controller = $controller('SidebarController', {
        $scope: scope,
      });
      $rootScope.$apply();
    });

    afterEach(() => {
      $httpBackend.verifyNoOutstandingExpectation(false);
      $httpBackend.verifyNoOutstandingRequest();
    });

    it('should have isCurrent() for / to return `current`', () => {
      $location.path('/');
      $rootScope.$apply();
      expect(controller.isCurrent($state.current)).to.equal('current');
    });
  });
});
