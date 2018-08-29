var ExpressHelper         = require('../../helpers/expressHelper');

module.exports = function(app) {
  var expressHelper = new ExpressHelper();
  var controller = app.controllers.item;

  app.route('/v1/items')
    .get(expressHelper.requireLogin, controller.getAll)
    .post(expressHelper.requireLogin, controller.save);

  app.route('/v1/items/:id')
    .get(expressHelper.requireLogin, controller.getById)
    .put(expressHelper.requireLogin, controller.update)
    .delete(expressHelper.requireLogin, controller.delete);
};
