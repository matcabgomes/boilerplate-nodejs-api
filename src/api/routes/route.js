var ExpressHelper         = require('../../helpers/expressHelper');

module.exports = function(app) {
  var expressHelper = new ExpressHelper();
  var controller = app.controllers.route;

  app.route('/v1/routes')
    .get(expressHelper.requireAdmin, controller.getAll)
    .post(expressHelper.requireAdmin, controller.save);

  app.route('/v1/routes/:id')
    .get(expressHelper.requireAdmin, controller.getById)
    .put(expressHelper.requireAdmin, controller.update)
    .delete(expressHelper.requireAdmin, controller.delete);
};
