var logger          = require('../config/logger');

module.exports = function() {
  return {
    tryMatchRoutes: function(req, routes) {
      for (var i = 0; i < routes.length; i++) {
        if (this.tryMatchRoute(req, routes[i])) {
          return routes[i];
        }
      };

      return null;
    },

    tryMatchRoute: function(req, route) {
      return this.tryMatchHeaders(req, route) &&
             this.tryMatchQueryString(req, route) &&
             this.tryMatchBody(req, route);
    },

    tryMatchQueryString: function(req, route) {
      if (!route.request.querystring) {
        return true;
      }

      for (k in route.request.querystring) {
        if (req.query[k] !== route.request.querystring[k]) {
          logger.info('req.query[' + k + '] !== route.request.querystring[' + k + ']');
          logger.info(req.query[k], route.request.querystring[k]);
          return false;
        }
      }

      return true;
    },

    tryMatchHeaders: function(req, route) {
      if (!route.request.headers) {
        return true;
      }

      for (k in route.request.headers) {
        var kl = k.toLowerCase();
        if (req.headers[kl] !== route.request.headers[kl]) {
          logger.info('req.headers[' + kl + '] !== route.request.headers[' + kl + ']');
          logger.info(req.headers[kl], route.request.headers[kl]);
          return false;
        }
      }

      return true;
    },

    tryMatchBody: function(req, route) {
      if (!route.request.body) {
        return true;
      }

      for (k in route.request.body) {
        if (req.body[k] !== route.request.body[k]) {
          logger.info('req.body[' + k + '] !== route.request.body[' + k + ']');
          logger.info(req.headers[k], route.request.headers[k]);
          return false;
        }
      }

      return true;
    },

    configureResponse: function(route, res) {
      logger.info('Configuring header response');
      for (k in route.response.headers) {
        logger.info('Setting the header ', k, route.response.headers[k]);
        res.set(k, route.response.headers[k]);
      }

      logger.info('Ending the response sending the status and content', route.response.status, route.response.body);
      res.status(route.response.status).send(route.response.body).end();
    }
  };
};
