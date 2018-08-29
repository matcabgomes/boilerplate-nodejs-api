var mongoose = require('mongoose');
var mongooseSchema =  mongoose.Schema;
var ObjectId = mongooseSchema.ObjectId;

var model = null;

module.exports = function(){
  var item = require('./item');
  var schema = mongooseSchema({

    userId: {
      type: String,
      required: true
    },
    tableId: {
      type: String,
      required: true
    },
    items:[
      {
      item:{
        type: ObjectId,
        ref: 'item'
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
