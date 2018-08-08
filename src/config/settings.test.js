var util      = require('util');

module.exports = {
mongoUrl : util.format('mongodb://%s/ristorante-test', process.env.DB_TESTE),
servicePort : 4003,
};
