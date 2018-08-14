var mongoose = require('mongoose');
var mongooseSchema =  mongoose.Schema;

var model = null;

module.exports = function(){
  var schema = mongooseSchema({
    //id usuario
    //id mesa
    //vetor de pratos
    userId: {
      type: String,
      required: true
    },
    tableId: {
      type: String,
      required: true
    },
    textTemplate: {
      type: String,
      required: true
    },
    from: {
      type: String,
      required: true
    },
    subject: {
      type: String,
      required: true
    },
    isEnabled: {
      type: Boolean,
      required: true
    },
  });

  model = model ? model : mongoose.model('orders', schema);

  return model;
};
