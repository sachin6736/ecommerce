const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const paymentSchema = new Schema({
  order: {
    type: mongoose.Types.ObjectId,
    ref: 'Order',
    required: true
  },
  method: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true
  },
  transactionId: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const Payment = mongoose.model('Payment', paymentSchema);
module.exports = Payment;
