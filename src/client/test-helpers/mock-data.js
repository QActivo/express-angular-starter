/* eslint no-unused-vars: 0*/

const mockData = (function () {
  return {
    getMockStates,
    getMockCountUsers,
    getMockDataCountAllTasks,
    getMockDataCountDoneTasks,
    getMockDataCountNotDoneTasks,
  };

  function getMockStates() {
    return [
      {
        state: 'home',
        config: {
          url: '/',
          template: '<h1>Home</h1>',
          title: 'home',
          settings: {
            nav: 1,
            content: '<i class="fa fa-home"></i> Home',
            roles: ['guest', 'admin', 'user'],
          },
        },
      },
    ];
  }

  function getMockCountUsers() {
    return 2;
  }

  function getMockDataCountAllTasks() {
    return 25;
  }

  function getMockDataCountDoneTasks() {
    return 17;
  }

  function getMockDataCountNotDoneTasks() {
    return 8;
  }
}());
