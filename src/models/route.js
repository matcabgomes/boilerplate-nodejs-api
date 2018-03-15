var mongoose = require('mongoose');
var mongooseSchema =  mongoose.Schema;

var model = null;

module.exports = function(){
  var schema = mongooseSchema({
    owner: {
      type: String,
      required: true
    },
    key: {
      type: String,
      required: true,
    },
    path: {
      type: String,
      required: true
    },
    request: {
      type: Object,
      required: true
    },
    response: {
      type: Object,
      required: true
    },
    isEnabled : {
      type: Boolean,
      required:true,
    }
  });

  model = model ? model : mongoose.model('routes', schema);

  return model;
};
