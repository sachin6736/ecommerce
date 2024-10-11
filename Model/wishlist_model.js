const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the schema for a wishlist
const wishlistSchema = new Schema({
  user_Id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  products: [{
    product_Id:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create the model from the schema
const Wishlist = mongoose.model('Wishlist', wishlistSchema);

module.exports = Wishlist;
