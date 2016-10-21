/* eslint no-undef: 0*/
describe('dashboard routes', function () {
  describe('state', function () {
    const views = {
      dashboard: 'app/dashboard/dashboard.html',
    };

    beforeEach(function () {
      module('app.dashboard', bard.fakeToastr);
      bard.inject('$location', '$httpBackend', '$rootScope', '$state', '$templateCache',
       'authentication');
      $templateCache.put(views.dashboard, '');

      sinon.stub(authentication, 'getUser').returns({
        id: 2,
        name: 'Admin',
        role: 'admin',
      });
    });

    afterEach(() => {
      $httpBackend.verifyNoOutstandingExpectation(false);
      $httpBackend.verifyNoOutstandingRequest();
    });

    it('should map /dashboard route to Dashboard View template', function () {
      expect($state.get('dashboard').templateUrl).to.equal(views.dashboard);
    });

    it('of dashboard should work with $state.go', function () {
      $location.path('/dashboard');
      $rootScope.$apply();
      expect($state.is('dashboard'));
    });
  });
});
