const Wishlist = require('../Model/wishlist_model')

module.exports = {


  Manage_Wishlist_icon:async(req,res)=>{
 try{
 
  let product_id =   req.params.id
 let wishlist_existing = await Wishlist.findOne({'products.product_Id':product_id})

 if(wishlist_existing)
 {
   return res.json({message:"already in wishlist"})
 }
 return res.json({message:"new to wishlist"})
 }
 catch(error){
  console.log(error.message)
  return res.redirect("/error_found")
 }
  },

  Add_to_Wishlist: async (req, res) => {
   try{
    const product_id = req.params.id
    const User_id = req.session.User._id

  
    let wishlist = await Wishlist.findOne({ user_Id: User_id})
    if(!wishlist)
    {
      wishlist =   new Wishlist({user_Id: User_id,products:[]})
       
    }

    wishlist.products.push(
      {product_Id:product_id}
    )
    
   const added_to_wishlist = wishlist.save()
    if (added_to_wishlist) {
      res.json("added to wishlist")

    }
   }
   catch(error){
    console.log(error.message)
  return res.redirect("/error_found")

   }
  },
  Remove_From_Wishlist:async(req,res)=>{
try{
  
  let product_id = req.params.id
  let  user_id = req.session.User._id
  const removed = await Wishlist.updateOne({ user_Id: user_id }, { $pull: { products: { product_Id:product_id } } })
  console.log("remove from wishlist",removed)
  if(removed.modifiedCount === 1){
   console.log("Start")
  return res.json({message:"removed"})
  }
  return res.json({message:"error"})

}
catch(error){
  console.log("error_found")
}
  }
}

