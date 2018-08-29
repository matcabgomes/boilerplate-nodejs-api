var Promise         = require('promise');
var logger          = require('../config/logger');

module.exports = function(dependencies) {
  var itemDAO = dependencies.itemDAO;
  var modelParser = dependencies.modelParser;

  return {
    dependencies: dependencies,

    clear: function() {
      return itemDAO.clear();
    },

    getAll: function(filter) {
      return new Promise(function(resolve, reject) {
        filter.isEnabled = true;
        logger.info('Listing all items by filter ', filter);
        itemDAO.getAll(filter)
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
        self.getByName(entity.name)
          .then(function(item) {
            if (!item) {
              logger.debug('Saving the item. Entity: ', JSON.stringify(entity));
              var o = modelParser.prepare(entity, true);
              logger.debug('Entity  after prepare: ', JSON.stringify(o));
              return itemDAO.save(o);
            } else {
              throw {
                status: 409,
                message: 'The name ' + entity.name + ' is already in use by other item'
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
        self.getByName(entity.name)
          .then(function(item) {
            if (!item || (item && item.id === entity.id)) {
              return itemDAO.update(o);
            } else {
              throw {
                status: 409,
                message: 'The name ' + entity.name + ' is already in use by other item'
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
        itemDAO.getById(id)
          .then(function(item) {
            if (item) {
              return modelParser.clear(item);
            } else {
              throw {
                status: 404,
                message: 'Item not found'
              };
            }
          })
          .then(resolve)
          .catch(reject);
      });
    },

    getByName: function(name) {
      var self = this;

      return new Promise(function(resolve, reject) {
        var filter = {
          name: name
        };

        self.getAll(filter)
          .then(function(items) {
            if (items.length) {
              logger.info('item found by name', JSON.stringify(items[0]));
              return items[0];
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
          .then(function(item) {
            if (!item) {
              throw {
                status: 404,
                message: 'Item not found'
              };
            } else {
              return itemDAO.disable(id);
            }
          })
          .then(resolve)
          .catch(reject);
      });
    }
  };
};
