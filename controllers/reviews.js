const reviews=require("../Model/reviews_model")

module.exports={
  
    post_review:async (req,res)=>{
      try{
        console.log("id",req.params.id)
        console.log("body", req.body)
        let product_Id =  req.params.id
        const user_id = req.session.User._id
        const{review,rating}=req.body

     
     let stored =   await reviews.create({
      product_Id:product_Id,
      user_Id : user_id,
      rating : rating,
      comment : review
        })
console.log(stored)
        if(stored){
          return   res.json("success")

        }
      }
      catch(error){
        console.log("error occured in reviews:",error.message)
      }
    }
}