var RouteBO               = require('../../business/routeBO');
var MockBO                = require('../../business/mockBO');
var DAOFactory            = require('../../daos/daoFactory');
var ModelParser           = require('../../models/modelParser');
var RequestMatcherHelper  = require('../../helpers/requestMatcherHelper');

module.exports = function() {
  var business = new MockBO({
    routeBO: new RouteBO({
      routeDAO: DAOFactory.getDAO('route'),
      modelParser: new ModelParser()
    }),
    requestMatcherHelper: new RequestMatcherHelper()
  });

  return {
    getRoute: function(req, res) {
      business.findRoute(req)
        .then(function(route) {
          if (route) {
            business.configureResponse(route, res);
          } else {
            res.status(404).json({
              status: 404,
              message: 'Can not match a configured route for the current request'
            });
          }
        })
        .catch(function(error) {
          console.log(error);
          res.status(500).json(error);
        });
    },
  };
};
