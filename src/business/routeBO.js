var Promise         = require('promise');
var logger          = require('../config/logger');

module.exports = function(dependencies) {
  var routeDAO = dependencies.routeDAO;
  var modelParser = dependencies.modelParser;

  return {
    dependencies: dependencies,

    clear: function() {
      return routeDAO.clear();
    },

    getAll: function(filter) {
      return new Promise(function(resolve, reject) {
        filter.isEnabled = true;
        logger.info('Listing all routes by filter ', filter);
        routeDAO.getAll(filter)
          .then(function(r) {
            resolve(r.map(function(item) {
              return modelParser.clear(item);
            }));
          })
          .catch(reject);
      });
    },

    save: function(entity) {
      var self = this;

      return new Promise(function(resolve, reject) {
        self.getByKey(entity.key)
          .then(function(route) {
            if (!route) {
              logger.debug('Saving the route. Entity: ', JSON.stringify(entity));
              var o = modelParser.prepare(entity, true);
              logger.debug('Entity  after prepare: ', JSON.stringify(o));
              return routeDAO.save(o);
            } else {
              throw {
                status: 409,
                message: 'The key ' + entity.key + ' is already in use by other route'
              };
            }
          })
          .then(function(r) {
            resolve(modelParser.clear(r));
          })
          .catch(reject);
      });
    },

    update: function(entity) {
      var self = this;

      return new Promise(function(resolve, reject) {
        var o = modelParser.prepare(entity, false);
        self.getByKey(entity.key)
          .then(function(route) {
            if (!route || (route && route.id === entity.id)) {
              return routeDAO.update(o);
            } else {
              throw {
                status: 409,
                message: 'The key ' + entity.key + ' is already in use by other route'
              };
            }
          })
          .then(function(r) {
            return modelParser.clear(r);
          })
          .then(resolve)
          .catch(reject);
      });
    },

    getById: function(id) {
      return new Promise(function(resolve, reject) {
        routeDAO.getById(id)
          .then(function(route) {
            if (route) {
              return modelParser.clear(route);
            } else {
              throw {
                status: 404,
                message: 'Route not found'
              };
            }
          })
          .then(resolve)
          .catch(reject);
      });
    },

    getByKey: function(key) {
      var self = this;

      return new Promise(function(resolve, reject) {
        var filter = {
          key: key
        };

        self.getAll(filter)
          .then(function(routes) {
            if (routes.length) {
              logger.info('Route found by key', JSON.stringify(routes[0]));
              return routes[0];
            } else {
              return null;
            }
          })
          .then(resolve)
          .catch(reject);
      });
    },

    delete: function(id) {
      var self = this;

      return new Promise(function(resolve, reject) {
        self.getById(id)
          .then(function(route) {
            if (!route) {
              throw {
                status: 404,
                message: 'Route not found'
              };
            } else {
              return routeDAO.disable(id);
            }
          })
          .then(resolve)
          .catch(reject);
      });
    },

    getAllByPathAndMethod: function(path, method) {
      var self = this;

      return new Promise(function(resolve, reject) {
        var filter = {
          path: path,
          'request.method': method
        };

        self.getAll(filter)
          .then(resolve)
          .catch(reject);
      });
    }
  };
};
