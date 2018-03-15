var RouteBO               = require('../../business/routeBO');
var DAOFactory            = require('../../daos/daoFactory');
var HTTPResponseHelper    = require('../../helpers/httpResponseHelper');
var ModelParser           = require('../../models/modelParser');

module.exports = function() {
  var business = new RouteBO({
    routeDAO: DAOFactory.getDAO('route'),
    modelParser: new ModelParser()
  });

  return {
    getAll: function(req, res) {
      var rh = new HTTPResponseHelper(req, res);
      business.getAll({})
        .then(rh.ok)
        .catch(rh.error);
    },

    save: function(req, res) {
      var rh = new HTTPResponseHelper(req, res);
      req.body.owner = req.currentUser.id;
      business.save(req.body)
        .then(function(r) {
          rh.created(r);
        })
        .catch(rh.error);
    },

    update: function(req, res) {
      var rh = new HTTPResponseHelper(req, res);
      req.body.owner = req.currentUser.id;
      req.body.id = req.params.id;
      business.update(req.body)
        .then(rh.ok)
        .catch(rh.error);
    },

    getById: function(req, res) {
      var rh = new HTTPResponseHelper(req, res);
      business.getById(req.params.id)
        .then(rh.ok)
        .catch(rh.error);
    },

    delete: function(req, res) {
      var rh = new HTTPResponseHelper(req, res);
      business.delete(req.params.id)
        .then(rh.ok)
        .catch(rh.error);
    }
  };
};
