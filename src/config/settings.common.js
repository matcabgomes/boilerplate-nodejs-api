var util      = require('util');

module.exports = {
    mongoUrl : util.format('mongodb://%s/%s',
                      process.env.DB_SERVER || 'localhost',
                      process.env.DB_NAME   || 'ristorante-menu'),
    servicePort : process.env.PORT || 3003,
    isMongoDebug : true,
    jwt: {
      secret: 'secret',
      expiresIn: '1h'
    },
    mailOptions: {
      host: 'host',
      port: 465,
      secure: true,
      auth: {
          user: 'user',
          pass: 'pass'
      }
    }
};
