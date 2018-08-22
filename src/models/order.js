var mongoose = require('mongoose');
var mongooseSchema =  mongoose.Schema;
var ObjectId = mongooseSchema.ObjectId;

var model = null;

module.exports = function(){
  var plate = require('./plate');
  var schema = mongooseSchema({

    userId: {
      type: String,
      required: true
    },
    tableId: {
      type: String,
      required: true
    },
    plates:[
      {
      plate:{
        type: ObjectId,
        ref: 'plate'
      }
    }
    ],
    isEnabled: {
      type: Boolean,
      required: false
    },
  });

  model = model ? model : mongoose.model('orders', schema);

  return model;
};
