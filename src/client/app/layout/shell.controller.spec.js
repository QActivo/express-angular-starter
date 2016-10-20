/* eslint no-undef: 0*/
describe('ShellController', function () {
  let controller;

  beforeEach(function () {
    bard.appModule('app.layout');
    bard.inject('$controller', '$httpBackend', '$q', '$rootScope', '$timeout');
  });

  beforeEach(function () {
    controller = $controller('ShellController');
    $rootScope.$apply();
  });

  afterEach(() => {
    $httpBackend.verifyNoOutstandingExpectation(false);
    $httpBackend.verifyNoOutstandingRequest();
  });

  describe('Shell controller', function () {
    it('should be created successfully', function () {
      expect(controller).to.be.defined;
    });

    it('should hide splash screen after timeout', function (done) {
      $timeout(function () {
        expect($rootScope.showSplash).to.be.false;
        done();
      }, 1000);
      $timeout.flush();
    });
  });
});
