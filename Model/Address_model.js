const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const addressSchema = new Schema({
  user_Id: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true
  },
  Addresses: [
    {
      house_name: {
        type: String,
        required: true
      },
      street: {
        type: String,
        required: true
      },
      area: {
        type: String,
        required: true
      },
      pincode: {
        type: String,
        required: true
      },
      landmark: {
        type: String
      },
      district: {
        type: String,
        required: true
      },
      state: {
        type: String,
        required: true
      },
      address_type: {
        type: String,
        enum:['Home','Work'],
        default:'Home',
        required: true
      }
    }
  ]
});

const Address = mongoose.model('Address', addressSchema);
module.exports = Address;
