var Promise         = require('promise');
var logger          = require('../config/logger');

module.exports = function(dependencies) {
  var plateDAO = dependencies.plateDAO;
  var modelParser = dependencies.modelParser;

  return {
    dependencies: dependencies,

    clear: function() {
      return plateDAO.clear();
    },

    getAll: function(filter) {
      return new Promise(function(resolve, reject) {
        filter.isEnabled = true;
        logger.info('Listing all plates by filter ', filter);
        plateDAO.getAll(filter)
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
          .then(function(plate) {
            if (!plate) {
              logger.debug('Saving the plate. Entity: ', JSON.stringify(entity));
              var o = modelParser.prepare(entity, true);
              logger.debug('Entity  after prepare: ', JSON.stringify(o));
              return plateDAO.save(o);
            } else {
              throw {
                status: 409,
                message: 'The key ' + entity.key + ' is already in use by other plate'
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
          .then(function(plate) {
            if (!plate || (plate && plate.id === entity.id)) {
              return plateDAO.update(o);
            } else {
              throw {
                status: 409,
                message: 'The key ' + entity.key + ' is already in use by other plate'
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
        plateDAO.getById(id)
          .then(function(plate) {
            if (plate) {
              return modelParser.clear(plate);
            } else {
              throw {
                status: 404,
                message: 'Template not found'
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
          .then(function(plates) {
            if (plates.length) {
              logger.info('plate found by key', JSON.stringify(plates[0]));
              return plates[0];
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
          .then(function(plate) {
            if (!plate) {
              throw {
                status: 404,
                message: 'Template not found'
              };
            } else {
              return plateDAO.disable(id);
            }
          })
          .then(resolve)
          .catch(reject);
      });
    }
  };
};
