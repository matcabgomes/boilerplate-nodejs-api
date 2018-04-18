var UserDAO             = require('./userDAO');
var MailTemplateDAO     = require('./mailTemplateDAO');
var AlertDAO            = require('./alertDAO');

module.exports = {
  getDAO: function(dao) {
    switch (dao) {
      case 'alert':
        return new AlertDAO();
      case 'user':
        return new UserDAO();
      case 'mailTemplate':
        return new MailTemplateDAO();
      default:
        return null;
    }
  }
};
