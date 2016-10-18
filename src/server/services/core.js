const service = {};

service.getIndexMessage = function () {
  return Promise.resolve({
    status: 'mean API',
  });
};

module.exports = service;
