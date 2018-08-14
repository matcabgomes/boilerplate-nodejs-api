var UserDAO             = require('./userDAO');
var MailTemplateDAO     = require('./mailTemplateDAO');
var AlertDAO            = require('./alertDAO');
var PlateDAO            = require('./plateDAO');

module.exports = {
  getDAO: function(dao) {
    switch (dao) {
      case 'alert':
        return new AlertDAO();
      case 'user':
        return new UserDAO();
      case 'mailTemplate':
        return new MailTemplateDAO();
      case 'plate':
        return new PlateDAO();
      default:
        return null;
    }
  }
};
