var logger              = require('winston');
var model               = require('../models/order')();
var Promise             = require('promise');
var $                   = require('mongo-dot-notation');

module.exports = function() {
  var projectionCommonFields = {
    __v: false,
    isEnabled: false,
  };

  return {
    clear: function() {
      return new Promise(function(resolve, reject) {
        model.remove({}, function(err) {
          if (err) {
            logger.log('error', 'An error has occurred while deleting all orders', error);
            reject(err);
          } else {
            logger.log('info', 'The orders have been deleted succesfully');
            resolve();
          }
        });
      });
    },

    getAll: function(filter) {
      return new Promise(function(resolve, reject) {
        logger.info('Getting orders from database', filter);

        model.find(filter, projectionCommonFields)
          .lean()
          .exec()
          .then(function(items) {
            logger.info('%d orders were returned', items.length);
            resolve(items);
          }).catch(function(erro) {
            logger.log('error', 'An error has ocurred while orders from database', erro);
            reject(erro);
          });
      });
    },

    save: function(entity) {
      var self = this;
      return new Promise(function(resolve, reject) {
        logger.log('info', 'Creating a new order', JSON.stringify(entity));
        model.create(entity)
        .then(function(item) {
          logger.log('info', 'The order has been created succesfully', JSON.stringify(item));
          return self.getById(item._id);
        })
        .then(resolve)
        .catch(function(error) {
          logger.error('An error has ocurred while saving a new order', error);
          reject({
            status: 422,
            message: error.message
          });
        });
      });
    },

    update: function(entity) {
      return new Promise(function(resolve, reject) {
        logger.log('info', 'Update a order');

        model.findByIdAndUpdate(entity._id, $.flatten(entity), {'new': true})
        .then(function(item) {
          logger.log('info', 'The order has been updated succesfully');
          logger.debug(JSON.stringify(item.toObject()));
          resolve(item.toObject());
        }).catch(function(error) {
          logger.error('An error has ocurred while updating a order', error);
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
        logger.log('info', 'Getting a order by id %s', id);

        self.getAll({_id: id, isEnabled: true})
        .then(function(orders) {
          if (orders.length === 0) {
            logger.info('order not found');
            resolve(null);
          } else {
            logger.info('The order was found');
            logger.debug(JSON.stringify(orders[0]));
            resolve(orders[0]);
          }
        }).catch(function(erro) {
            logger.log('error', 'An error has occurred while getting a order by id %s', id, erro);
            reject(erro);
        });
      });
    },

    disable: function(id) {
      return new Promise(function(resolve, reject) {
        logger.log('info', 'Disabling a order');

        model.findByIdAndUpdate(id, {_id:id, isEnabled: false}, {'new': true, fields: projectionCommonFields})
        .then(function(item) {
          logger.log('info', 'The order has been disabled succesfully');
          resolve(item.toObject());
        }).catch(function(error) {
          logger.error('An error has ocurred while disabling a order', error);
          reject({
            status: 422,
            message: error
          });
        });
      });
    },
  };
};
