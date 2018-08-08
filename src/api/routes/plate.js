var ExpressHelper         = require('../../helpers/expressHelper');

module.exports = function(app) {
  var expressHelper = new ExpressHelper();
  var controller = app.controllers.plate;

  app.route('/v1/plates')
    .get(expressHelper.requireLogin, controller.getAll)
    .post(expressHelper.requireLogin, controller.save);

  app.route('/v1/plates/:id')
    .get(expressHelper.requireLogin, controller.getById)
    .put(expressHelper.requireLogin, controller.update)
    .delete(expressHelper.requireLogin, controller.delete);
};
