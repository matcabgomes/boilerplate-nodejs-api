var MailTemplateBO        = require('./mailTemplateBO');
var UserBO                = require('./userBO');
var AlertBO               = require('./alertBO');
var NotificationBO        = require('./notificationBO');
var DAOFactory            = require('../daos/daoFactory');
var ModelParser           = require('../models/modelParser');
var HelperFactory         = require('../helpers/helperFactory');
var PlateBO               = require('./plateBO');

function factory(dao) {
  switch (dao) {
    case 'alert':
      return new AlertBO({
        alertDAO: DAOFactory.getDAO('alert'),
        modelParser: new ModelParser(),
        dateHelper: HelperFactory.getHelper('date')
      });
    case 'mailTemplate':
      return new MailTemplateBO({
        mailTemplateDAO: DAOFactory.getDAO('mailTemplate'),
        modelParser: new ModelParser()
      });
    case 'plate':
      return new PlateBO({
        plateDAO: DAOFactory.getDAO('plate'),
        modelParser: new ModelParser()
      });
    case 'notification':
      var modelParser = new ModelParser();

      return new NotificationBO({
        mailTemplateBO: new MailTemplateBO({
          mailTemplateDAO: DAOFactory.getDAO('mailTemplate'),
          modelParser: modelParser,
        }),
        userBO: new UserBO({
          userDAO: DAOFactory.getDAO('user'),
          jwtHelper: HelperFactory.getHelper('jwt'),
          modelParser: modelParser,
          userHelper: HelperFactory.getHelper('user')
        }),
        dynamicTextHelper: HelperFactory.getHelper('dynamicText'),
        sendMailHelper: HelperFactory.getHelper('sendMail'),
      });
    case 'user':
      return new UserBO({
        userDAO: DAOFactory.getDAO('user'),
        jwtHelper: HelperFactory.getHelper('jwt'),
        modelParser: new ModelParser(),
        notificationBO: factory('notification'),
        addressBO: factory('address'),
        alertBO: factory('alert')
      });
    default:
      return null;
  }
};

module.exports = {getBO: factory};
