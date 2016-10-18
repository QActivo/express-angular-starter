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

    bard.verifyNoOutstandingHttpRequests();

    it('should have isCurrent() for / to return `current`', () => {
      $location.path('/');
      expect(controller.isCurrent($state.current)).to.equal('current');
    });

    it('should have isCurrent() for /customers to return `current`', () => {
      $location.path('/customers');
      expect(controller.isCurrent($state.current)).to.equal('current');
    });

    it('should have isCurrent() for non route not return `current`', () => {
      $location.path('/invalid');
      expect(controller.isCurrent({ title: 'invalid' })).not.to.equal('current');
    });
  });
});
