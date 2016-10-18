/* eslint no-unused-vars: 0*/

const mockData = (function () {
  return {
    getMockStates,
    getMockDataForGraph,
  };

  function getMockStates() {
    return [
      {
        state: 'dashboard',
        config: {
          url: '/',
          templateUrl: 'app/dashboard/dashboard.html',
          title: 'dashboard',
          settings: {
            nav: 1,
            content: '<i class="fa fa-dashboard"></i> Dashboard',
            roles: ['guest', 'admin', 'user'],
          },
        },
      },
    ];
  }

  function getMockDataForGraph() {
    return [
      {
        date: '2016-10-07T03:00:00.000Z',
        passesCount: 2,
      },
      {
        date: '2016-10-07T03:00:00.000Z',
        passesCount: 2,
      },
    ];
  }
}());
