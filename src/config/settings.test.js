var util      = require('util');

module.exports = {
mongoUrl : util.format('mongodb://%s/ristorante-test', 'localhost' || process.env.DB_TEST ),
servicePort : 4003,
};
