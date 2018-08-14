var logger              = require('winston');
var model               = require('../models/plate')();
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
            logger.log('error', 'An error has occurred while deleting all plates', error);
            reject(err);
          } else {
            logger.log('info', 'The plates have been deleted succesfully');
            resolve();
          }
        });
      });
    },

    getAll: function(filter) {
      return new Promise(function(resolve, reject) {
        logger.info('Getting plates from database', filter);

        model.find(filter, projectionCommonFields)
          .lean()
          .exec()
          .then(function(items) {
            logger.info('%d plates were returned', items.length);
            resolve(items);
          }).catch(function(erro) {
            logger.log('error', 'An error has ocurred while plates from database', erro);
            reject(erro);
          });
      });
    },

    save: function(entity) {
      var self = this;
      return new Promise(function(resolve, reject) {
        logger.log('info', 'Creating a new plate', JSON.stringify(entity));
        entity.createdAt = new Date();
        model.create(entity)
        .then(function(item) {
          logger.log('info', 'The plate has been created succesfully', JSON.stringify(item));
          return self.getById(item._id);
        })
        .then(resolve)
        .catch(function(error) {
          logger.error('An error has ocurred while saving a new plate', error);
          reject({
            status: 422,
            message: error.message
          });
        });
      });
    },

    update: function(entity) {
      return new Promise(function(resolve, reject) {
        logger.log('info', 'Update a plate');

        model.findByIdAndUpdate(entity._id, $.flatten(entity), {'new': true})
        .then(function(item) {
          logger.log('info', 'The plate has been updated succesfully');
          logger.debug(JSON.stringify(item.toObject()));
          resolve(item.toObject());
        }).catch(function(error) {
          logger.error('An error has ocurred while updating a plate', error);
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
        logger.log('info', 'Getting a plate by id %s', id);

        self.getAll({_id: id, isEnabled: true})
        .then(function(plates) {
          if (plates.length === 0) {
            logger.info('plate not found');
            resolve(null);
          } else {
            logger.info('The plate was found');
            logger.debug(JSON.stringify(plates[0]));
            resolve(plates[0]);
          }
        }).catch(function(erro) {
            logger.log('error', 'An error has occurred while getting a plate by id %s', id, erro);
            reject(erro);
        });
      });
    },

    disable: function(id) {
      return new Promise(function(resolve, reject) {
        logger.log('info', 'Disabling a plate');

        model.findByIdAndUpdate(id, {_id:id, isEnabled: false}, {'new': true, fields: projectionCommonFields})
        .then(function(item) {
          logger.log('info', 'The plate has been disabled succesfully');
          resolve(item.toObject());
        }).catch(function(error) {
          logger.error('An error has ocurred while disabling a plate', error);
          reject({
            status: 422,
            message: error
          });
        });
      });
    },
  };
};
