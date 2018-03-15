var logger              = require('winston');
var model               = require('../models/route')();
var Promise             = require('promise');
var $                   = require('mongo-dot-notation');

module.exports = function() {
  var projectionCommonFields = {
    owner: false,
    __v: false,
    isEnabled: false,
  };

  return {
    clear: function() {
      return new Promise(function(resolve, reject) {
        model.remove({}, function(err) {
          if (err) {
            logger.log('error', 'An error has occurred while deleting all routes', error);
            reject(err);
          } else {
            logger.log('info', 'The routes have been deleted succesfully');
            resolve();
          }
        });
      });
    },

    getAll: function(filter) {
      return new Promise(function(resolve, reject) {
        logger.info('Getting routes from database', filter);

        model.find(filter, projectionCommonFields)
          .lean()
          .exec()
          .then(function(items) {
            logger.info('%d routes were returned', items.length);
            resolve(items);
          }).catch(function(erro) {
            logger.log('error', 'An error has ocurred while routes from database', erro);
            reject(erro);
          });
      });
    },

    save: function(entity) {
      var self = this;
      return new Promise(function(resolve, reject) {
        logger.log('info', 'Creating a new route', JSON.stringify(entity));
        model.create(entity)
        .then(function(item) {
          logger.log('info', 'The route has been created succesfully', JSON.stringify(item));
          return self.getById(item._id);
        })
        .then(resolve)
        .catch(function(error) {
          logger.error('An error has ocurred while saving a new route', error);
          reject({
            status: 422,
            message: error.message
          });
        });
      });
    },

    update: function(entity) {
      return new Promise(function(resolve, reject) {
        logger.log('info', 'Updating a route');

        model.findByIdAndUpdate(entity._id, $.flatten(entity), {'new': true, fields: projectionCommonFields})
        .then(function(item) {
          logger.log('info', 'The route has been updated succesfully');
          logger.debug(JSON.stringify(item.toObject()));
          resolve(item.toObject());
        }).catch(function(error) {
          logger.error('An error has ocurred while updating a route', error);
          reject({
            status: 422,
            message: error
          });
        });
      });
    },

    getById: function(id) {
      var self = this;
      return new Promise(function(resolve, reject) {
        logger.log('info', 'Getting a route by id %s', id);

        self.getAll({_id: id, isEnabled: true})
        .then(function(routes) {
          if (routes.length === 0) {
            logger.info('Route not found');
            resolve(null);
          } else {
            logger.info('The route was found');
            logger.debug(JSON.stringify(routes[0]));
            resolve(routes[0]);
          }
        }).catch(function(erro) {
            logger.log('error', 'An error has occurred while getting a route by id %s', id, erro);
            reject(erro);
        });
      });
    },

    disable: function(id) {
      return new Promise(function(resolve, reject) {
        logger.log('info', 'Disabling a route');

        model.findByIdAndUpdate(id, {_id:id, isEnabled: false}, {'new': true, fields: projectionCommonFields})
        .then(function(item) {
          logger.log('info', 'The route has been disabled succesfully');
          resolve(item.toObject());
        }).catch(function(error) {
          logger.error('An error has ocurred while disabling a route', error);
          reject({
            status: 422,
            message: error
          });
        });
      });
    },
  };
};
