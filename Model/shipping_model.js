const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const shippingSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  rate: {
    type: Number,
    required: true
  },
  delivery_date: {
    type: Date,
    required: true
  },
  order: {
    type: mongoose.Types.ObjectId,
    ref: 'Order',
    required: true
  }
});

const Shipping = mongoose.model('Shipping', shippingSchema);
module.exports = Shipping;
