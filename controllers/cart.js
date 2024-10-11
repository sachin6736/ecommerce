const cart = require("../Model/cart_model")
let product = require("../Model/products_model")

module.exports = {

  Add_to_Cart: async (req, res) => {
    try {

      let { quantity } = req.body
      let User_id = req.session.User._id
      let Product_id = req.params.id
        let Cart = await cart.findOne({ user_Id: User_id })
        if (!Cart) {

          Cart = new cart({ user_Id: User_id, items: [] })
        }

        Cart.items.push({
          product_Id: Product_id,
          Quantity: quantity
        })
        const created_cart = await Cart.save()
        if (created_cart) {
          res.json("Added to cart")
        }
      

    }
    catch (error) {
      console.log("error occurs:", error.message)
      return res.redirect("/error_found")
    }
  },

  Remove_From_Cart: async (req, res) => {
try{
  
  let item_id = req.params.id
  let user_id = req.session.User._id
  const removed = await cart.updateOne({ user_Id: user_id }, { $pull: { items: { product_Id: item_id } } })
  if (removed.modifiedCount === 1) {
    return res.json("Removed from Cart")
  }
  else {
    return res.json("there is an error occured when removing from cart")
  }
}
catch(error){
  console.log(error.message)
 return  res.redirect("/error_found")
}
  },
  update_cart_quantity:async (req,res)=>{
   try{
    user_id = req.session.User._id
    let  product_id = req.params.id
    let {quantity}=req.body
 
    let quantity_updated = await cart.updateOne(
      { user_Id: user_id, "items.product_Id": product_id }, // Query to find the document with the specific user and product
      { $set: { "items.$.Quantity": quantity } } // Update the quantity of the specific item
    );
   console.log(quantity_updated)
   if(quantity_updated.modifiedCount === 1){
    return res.json({success:true})
       
   }
   }
   catch(error){
    console.log(error.message)
    return res.redirect("/error_found")
   }
  }

  
}