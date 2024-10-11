const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cartSchema = new Schema({
  user_Id: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  items:[ {
    product_Id:{ type: Schema.Types.ObjectId,ref: 'Product',},
      Quantity:{type:Number,default:1,required:true},
      _id:false,
    }],
   
    createdAt: {
      type: Date,
      default: Date.now
  },
   
  })

const Cart = mongoose.model('Cart', cartSchema);
module.exports = Cart;
