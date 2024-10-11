const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const subCategorySchema = new Schema({
  name: {
    type: String,
    required: true
  },
 
  category_Id: {
    type: Schema.Types.ObjectId,
    ref: 'Category',

}
});

const subcategory = mongoose.model('subcategory', subCategorySchema);
module.exports = subcategory;
