var UserDAO             = require('./userDAO');
var MailTemplateDAO     = require('./mailTemplateDAO');
var RouteDAO            = require('./routeDAO');

module.exports = {
  getDAO: function(dao) {
    switch (dao) {
      case 'user':
        return new UserDAO();
      case 'route':
        return new RouteDAO();
      case 'mailTemplate':
        return new MailTemplateDAO();
      default:
        return null;
    }
  }
};
