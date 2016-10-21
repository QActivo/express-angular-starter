/* eslint no-undef: 0*/
describe('DashboardController', function () {
  let controller;
  const userCount = mockData.getMockCountUsers();
  const taskCount = mockData.getMockDataCountAllTasks();
  const taskDoneCount = mockData.getMockDataCountDoneTasks();
  const taskNotDoneCount = mockData.getMockDataCountNotDoneTasks();

  beforeEach(function () {
    bard.appModule('app.dashboard');
    bard.inject('$controller', '$httpBackend', '$q', '$rootScope', 'usersservice',
     'taskservice', 'authentication');
  });

  beforeEach(function () {
    sinon.stub(usersservice, 'getCount').returns($q.when(userCount));
    sinon.stub(taskservice, 'getCount').returns($q.when(taskCount));
    sinon.stub(taskservice, 'getCountDone').returns($q.when(taskDoneCount));
    sinon.stub(taskservice, 'getCountNotDone').returns($q.when(taskNotDoneCount));
    controller = $controller('DashboardController');
    $rootScope.$apply();
  });

  afterEach(() => {
    $httpBackend.verifyNoOutstandingExpectation(false);
    $httpBackend.verifyNoOutstandingRequest();
  });

  describe('Dashboard controller', function () {
    it('should be created successfully', function () {
      expect(controller).to.be.defined;
    });

    describe('after activate', function () {
      it('should have title of Dashboard', function () {
        expect(controller.title).to.equal('Dashboard');
      });

      it('should be equal to 2 the count of users', function () {
        expect(controller.userCount).to.equal(2);
      });

      it('should be equal to 17 the count of done tasks', function () {
        expect(controller.taskDoneCount).to.equal(17);
      });

      it('should be equal to 8 the count of not done tasks', function () {
        expect(controller.taskNotDoneCount).to.equal(8);
      });
    });
  });
});
