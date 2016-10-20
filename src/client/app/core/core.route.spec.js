/* eslint no-undef: 0*/
describe('core', function () {
  describe('state', function () {
    const views = {
      four0four: 'app/core/404.html',
    };

    beforeEach(function () {
      module('app.core', bard.fakeToastr);
      bard.inject('$location', '$httpBackend', '$rootScope', '$state', '$templateCache');
      $templateCache.put(views.four0four, '');
    });

    afterEach(() => {
      $httpBackend.verifyNoOutstandingExpectation(false);
      $httpBackend.verifyNoOutstandingRequest();
    });

    it('should map /404 route to 404 View template', function () {
      expect($state.get('404').templateUrl).to.equal(views.four0four);
    });

    it('of dashboard should work with $state.go', function () {
      $location.path('/404');
      $rootScope.$apply();
      expect($state.is('404'));
    });

    it('should route /invalid to the otherwise (404) route', function () {
      $location.path('/invalid');
      $rootScope.$apply();
      expect($state.current.templateUrl).to.equal(views.four0four);
    });
  });
});
