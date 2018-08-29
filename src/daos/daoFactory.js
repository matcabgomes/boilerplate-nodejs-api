var UserDAO             = require('./userDAO');
var MailTemplateDAO     = require('./mailTemplateDAO');
var AlertDAO            = require('./alertDAO');
var ItemDAO            = require('./itemDAO');
var OrderDAO            = require('./orderDAO');

module.exports = {
  getDAO: function(dao) {
    switch (dao) {
      case 'alert':
        return new AlertDAO();
      case 'user':
        return new UserDAO();
      case 'mailTemplate':
        return new MailTemplateDAO();
      case 'item':
        return new ItemDAO();
      case 'order':
        return new OrderDAO();
      default:
        return null;
    }
  }
};
