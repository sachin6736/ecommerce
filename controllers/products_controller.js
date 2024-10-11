const products=require("../Model/products_model")
const categories =  require("../Model/categories_model")
const subcategories = require("../Model/sub_categories_model")

module.exports={
    
    get_product_Adding_Page :async(req,res)=>{
      try{
      const Categories =await  categories.find()
        const product_Add_errormsg =  req.session.Add_product_error
        req.session.Add_product_error = null;
        const admin = req.session.admin;     
        if (admin) {
            res.render('Add_product', {admin,product_Add_errormsg,Categories});
        } else {
            res.redirect('/login'); // Redirect to login if admin is not in session
        }
      }
      catch(error)
      {
        console.log(error.message)
      }
    },
    
    Add_product :async(req,res)=>{
     try
     {
      console.log("hello product adding")
     const {name,description,categoryId,sub_category_Id,price,brand,stock} = req.body
     let image_files = req.files
     let image_filenames =[]
   
      for(let file of image_files)
        {
        image_filenames.push(file.filename) 
        } 


        console.log("image files",image_filenames)

        
     if (!name || !description || !price || !categoryId || !brand ||!sub_category_Id|| !stock  || !image_filenames )
        {
         req.session.Add_product_error ="All fields are required"
        return res.redirect("/Add_product")
        }
        console.log("error checked")
     const created = await products.create({name:name,description:description,category_Id:categoryId,sub_category_Id:sub_category_Id,price:price,brand:brand,images:image_filenames,stock:stock})
     console.log("addedto database")
    if(created)
      {
      console.log("success")

      res.status(200).json({success:true})
      }
      } catch(error)
     {
      console.log(error.message);
     }

    },

    filter_Products:async(req,res)=>{
       console.log(req.query)
        const { categoryId, availability, priceFrom, priceTo } = req.query;
        let filter = {};
        // Filter by category if it's not "all"
        if (categoryId && categoryId !== "all") {
          filter.category_Id = categoryId;
        }
        if(availability && availability !== "all")
          {
           
            if(availability ===  "in-stock")
              {
             

                filter.stock = {$gt :0}
              }
            else if(availability === "out-of-stock")
              {
                filter.stock ={$lte :0}
              }
          }
          if(priceFrom)
            {
              filter.price ={$gte:parseFloat(priceFrom)}
            }
          if(priceTo)
            {
              filter.price ={$lte:parseFloat(priceTo)}
            }  
       console.log(filter)
  
    const  Categories = await categories.find();
    const Products = await products.find(filter);
        const admin = req.session.admin;   
         if (admin) {
             res.render('Products', {admin,Products,Categories});
         } else {
             res.redirect('/login'); // Redirect to login if admin is not in session
         }
  

  },
    get_update_productpage :async(req,res)=>{
      const product_id = req.params._id
      const product =await products.findById(product_id)  
      const  Categories = await categories.find();
      const categoryid = product.category_Id
      const SubCategories = await subcategories.find({category_Id:categoryid});
      const admin = req.session.admin;     
        if (admin) {
            res.render('Product_update', {admin,product,Categories,SubCategories});
        } else {
            res.redirect('/login') // Redirect to login if admin is not in session
        }
      
    },
    update_product_details :async(req,res)=>{
      try{
          console.log(req.params.id)
        const product_id =req.params.id
        let image_files = req.files
        let image_filenames =[]
      
         for(let file of image_files)
           {
           image_filenames.push(file.filename) 
           } 
  
    console.log(image_filenames)
        const {name,description,categoryId,Sub_category_Id,price,brand,stock} =req.body
        console.log(stock)
        console.log(product_id)
        const updated = await products.updateOne({_id:product_id},{$set:{name:name,description:description,category_Id:categoryId,sub_category_Id:Sub_category_Id,price:price,brand:brand,images:image_filenames,stock:stock}})
    console.log(updated)
    if(updated.modifiedCount === 1)
      {
        return res.json({success:true})
      }
    
     
      }
      catch(error)
      {
        console.log(error.message)
      }
    },

    delete_product :async(req,res)=>{
      try{
      const product_id = req.params._id
   
      const deleted = await  products.deleteOne({_id:product_id})
     
      if(deleted.deletedCount === 1)
        {
       
      res.status(200).json({ message: 'Product deleted successfully' })        
        }
       
      }
      catch(error)
      {
        console.log(error.message)
      }
}
}