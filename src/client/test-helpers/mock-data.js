/* eslint no-unused-vars: 0*/

const mockData = (function () {
  return {
    getMockStates,
    getMockDataForGraph,
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
