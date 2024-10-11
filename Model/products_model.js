const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    
category_Id: {
    type: Schema.Types.ObjectId,
    ref: 'category',
    },
sub_category_Id: {
    type: Schema.Types.ObjectId,
    ref: 'subcategory',
},
    price: {
        type: Number,
        required: true
    },
   
    brand: {
        type: String,
        required: true
    },
    images: [{
        type: String,
        
    }],
    stock: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
