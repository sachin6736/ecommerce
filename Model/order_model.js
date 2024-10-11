const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true
  },
  Address_Id:{
    type: mongoose.Types.ObjectId,
    ref: 'Address',
    required: true
  },
  products: [{
    product_Id: {
      type: mongoose.Types.ObjectId,
      ref: 'Product'
    },
    quantity: {
      type: Number
    }
  }],
  date: {
    type: Date,
    default: Date.now
  },
  total_Price: {
    type: Number,
    required: true
  },
  total_Quantity:{
    type: Number,
    required: true
  },
  status: {
    type: String,
    required: true,
    enum: ['Order Placed','Paid', 'Order Confirmed', 'Shipped', 'Out for Delivery', 'Delivered'],
    default: 'Pending'
  }
 
});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
