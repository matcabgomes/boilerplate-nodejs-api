var Promise         = require('promise');

module.exports = function(dependencies) {
  var routeBO = dependencies.routeBO;
  var requestMatcherHelper = dependencies.requestMatcherHelper;

  return {
    findRoute: function(request) {
      return new Promise(function(resolve, reject) {
        var chain = Promise.resolve();

        chain
          .then(function() {
            // removing the initial path /mock
            var path = request.path.replace('/mock/', '/');
            var method = request.method;

            return routeBO.getAllByPathAndMethod(path, method);
          })
          .then(function(routes) {
            return requestMatcherHelper.tryMatchRoutes(request, routes);
          })
          .then(resolve)
          .catch(reject);
      });
    },

    configureResponse: function(route, response) {
      return requestMatcherHelper.configureResponse(route, response);
    }
  };
};
