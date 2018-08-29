var logger              = require('winston');
var model               = require('../models/item')();
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
            logger.log('error', 'An error has occurred while deleting all items', error);
            reject(err);
          } else {
            logger.log('info', 'The items have been deleted succesfully');
            resolve();
          }
        });
      });
    },

    getAll: function(filter) {
      return new Promise(function(resolve, reject) {
        logger.info('Getting items from database', filter);

        model.find(filter, projectionCommonFields)
          .lean()
          .exec()
          .then(function(items) {
            logger.info('%d items were returned', items.length);
            resolve(items);
          }).catch(function(erro) {
            logger.log('error', 'An error has ocurred while items from database', erro);
            reject(erro);
          });
      });
    },

    save: function(entity) {
      var self = this;
      return new Promise(function(resolve, reject) {
        logger.log('info', 'Creating a new item', JSON.stringify(entity));
        entity.createdAt = new Date();
        model.create(entity)
        .then(function(item) {
          logger.log('info', 'The item has been created succesfully', JSON.stringify(item));
          return self.getById(item._id);
        })
        .then(resolve)
        .catch(function(error) {
          logger.error('An error has ocurred while saving a new item', error);
          reject({
            status: 422,
            message: error.message
          });
        });
      });
    },

    update: function(entity) {
      return new Promise(function(resolve, reject) {
        logger.log('info', 'Update a item');

        model.findByIdAndUpdate(entity._id, $.flatten(entity), {'new': true})
        .then(function(item) {
          logger.log('info', 'The item has been updated succesfully');
          logger.debug(JSON.stringify(item.toObject()));
          resolve(item.toObject());
        }).catch(function(error) {
          logger.error('An error has ocurred while updating a item', error);
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
        logger.log('info', 'Getting a item by id %s', id);

        self.getAll({_id: id, isEnabled: true})
        .then(function(items) {
          if (items.length === 0) {
            logger.info('item not found');
            resolve(null);
          } else {
            logger.info('The item was found');
            logger.debug(JSON.stringify(items[0]));
            resolve(items[0]);
          }
        }).catch(function(erro) {
            logger.log('error', 'An error has occurred while getting a item by id %s', id, erro);
            reject(erro);
        });
      });
    },

    disable: function(id) {
      return new Promise(function(resolve, reject) {
        logger.log('info', 'Disabling a item');

        model.findByIdAndUpdate(id, {_id:id, isEnabled: false}, {'new': true, fields: projectionCommonFields})
        .then(function(item) {
          logger.log('info', 'The item has been disabled succesfully');
          resolve(item.toObject());
        }).catch(function(error) {
          logger.error('An error has ocurred while disabling a item', error);
          reject({
            status: 422,
            message: error
          });
        });
      });
    },
  };
};
