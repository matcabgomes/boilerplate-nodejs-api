var util      = require('util');

module.exports = {
mongoUrl : util.format('mongodb://%s/ristorante-test',
                        process.env.DB_TEST || 'localhost'),
servicePort : 4003,
};
