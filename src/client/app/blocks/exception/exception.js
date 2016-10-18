(function () {
  'use strict';

  angular
    .module('blocks.exception')
    .factory('exception', exception);

  /* @ngInject */
  function exception($q, logger) {
    const service = {
      catcher,
    };
    return service;

    function catcher(message) {
      return function (e) {
        let thrownDescription;
        let newMessage;
        if (e.data && e.data.msg) {
          thrownDescription = '\n' + e.data.msg;
          newMessage = message + thrownDescription;
        }
        e.data.msg = newMessage;
        logger.error(newMessage);
        return $q.reject(e);
      };
    }
  }
}());
