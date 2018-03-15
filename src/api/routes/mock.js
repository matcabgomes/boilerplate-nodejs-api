module.exports = function(app) {
  var controller = app.controllers.mock;

  app.route('/mock/*')
    .all(controller.getRoute);
};
