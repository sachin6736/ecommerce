const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Import SubCategory mode 

const categorySchema = new Schema({
  name: {
    type: String,
    required: true
  },
 image:{
  type:String,
  required:true
 }
  
});

const category = mongoose.model('category', categorySchema);
module.exports = category;
