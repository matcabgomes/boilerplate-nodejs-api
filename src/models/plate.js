var mongoose = require('mongoose');
var mongooseSchema =  mongoose.Schema;

var model = null;

module.exports = function(){
  var schema = mongooseSchema({
    name: {
      type: String,
      required: true
    },
    ingredients: [],
    description: {
      type: String,
      required: false
    },
    price: {
      type: Number,
      required: true
    },
    available: {
      type: Boolean,
      required: true
    },
    image: {
      type: String,
      required: false
    },
    createdAt: {
      type: Date,
      required: true
    },
    isEnabled: {
      type: Boolean,
      required: true
    }
  });

  model = model ? model : mongoose.model('plates', schema);

  return model;
};
