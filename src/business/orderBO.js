var Promise         = require('promise');
var logger          = require('../config/logger');

module.exports = function(dependencies) {
  var orderDAO = dependencies.orderDAO;
  var modelParser = dependencies.modelParser;

  return {
    dependencies: dependencies,

    clear: function() {
      return orderDAO.clear();
    },

    getAll: function(filter) {
      return new Promise(function(resolve, reject) {
        filter.isEnabled = true;
        logger.info('Listing all orders by filter ', filter);
        orderDAO.getAll(filter)
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
          .then(function(order) {
            if (!order) {
              logger.debug('Saving the order. Entity: ', JSON.stringify(entity));
              var o = modelParser.prepare(entity, true);
              logger.debug('Entity  after prepare: ', JSON.stringify(o));
              return orderDAO.save(o);
            } else {
              throw {
                status: 409,
                message: 'The key ' + entity.key + ' is already in use by other order'
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
          .then(function(order) {
            if (!order || (order && order.id === entity.id)) {
              return orderDAO.update(o);
            } else {
              throw {
                status: 409,
                message: 'The key ' + entity.key + ' is already in use by other order'
              };
            }
          })
          .then(function(r) {
            resolve(modelParser.clear(r));
          })
          .catch(reject);
      });
    },

    getById: function(id) {
      return new Promise(function(resolve, reject) {
        orderDAO.getById(id)
          .then(function(order) {
            if (order) {
              return modelParser.clear(order);
            } else {
              throw {
                status: 404,
                message: 'order not found'
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
          .then(function(orders) {
            if (orders.length) {
              logger.info('order found by key', JSON.stringify(orders[0]));
              return orders[0];
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
          .then(function(order) {
            if (!order) {
              throw {
                status: 404,
                message: 'order not found'
              };
            } else {
              return orderDAO.disable(id);
            }
          })
          .then(resolve)
          .catch(reject);
      });
    }
  };
};
