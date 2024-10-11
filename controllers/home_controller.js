
const products = require("../Model/products_model")
const categories = require("../Model/categories_model")
const subcategories = require("../Model/products_model")
const cart = require("../Model/cart_model")
const Wishlist = require("../Model/wishlist_model")
const reviews = require("../Model/reviews_model")
const User = require("../Model/user_model")
const address = require("../Model/Address_model")
const orders = require("../Model/order_model")
const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');


module.exports = {
  get_error_page: (req, res) => {
    res.render("errorPage", {
      errorCode: 500,
      errorMessage: 'Error Occurred',
      errorDetails: message
    })
  },
  Search_Input:async(req,res)=>{
 try{
  console.log(req.query)
  let {query} = req.query
  const Products = await products.find({ name: { $regex: query, $options: 'i' } })
console.log(Products)
res.json({Products})
 }
 catch(error)
 {
  console.log(error.messsage)
 }
  },
  get_home: async (req, res) => {
    try {


      console.log(req.session.User)

      const Products = await products.find();
      const Categories = await categories.find();
      const isAuth = req.session.isAuth;

      let user;
      let Item_Count = 0;
      let TotalPrice = 0;
      let wishlist_count = 0;
      let Price = 0;

      if (isAuth) {
        console.log(req.session.User)

        user = req.session.User;
        let my_cart = await cart.findOne({ user_Id: user._id });

        if (my_cart && my_cart.items) {
          let product_items = my_cart.items;
          product_Count = product_items.length;

          let Prices = [];
          for (let item of product_items) {
            // 

            let item_quantity = item.Quantity

            let product_id
            if (item.product_Id) {
              product_id = item.product_Id;
            }


            const product = await products.findOne({ _id: product_id });
            if (product) {

              Price = product.price * item_quantity

              Prices.push(Price);
            }
          }
          Item_Count = product_items.reduce((acc, i) => acc + i.Quantity, 0)

          TotalPrice = Prices.reduce((acc, price) => acc + price, 0);
        }
        let tocheck_products_incart = await products.find()
        tocheck_products_incart

        const wishlist = await Wishlist.findOne({ user_Id: user._id });
        if (wishlist && wishlist.products) {
          wishlist_count = wishlist.products.length;
        }
        const Cart = await cart.find({ user_Id: user._id })

        const USER = await User.findOne({ _id: user._id })

        return res.render("home", {
          isAuth,
          USER,
          Products,
          Categories,
          Cart,
          Item_Count,
          TotalPrice,
          wishlist_count,
         
        });


      }

      return res.render("home", { isAuth, Products, Categories });
    } catch (error) {
      console.log("error occurs in home:", error.message);
      return res.redirect("/error_found")

    }

  },


  get_userAccount: async (req, res) => {
    try {
      const Products = await products.find()
      const Categories = await categories.find()

      const isAuth = req.session.isAuth

      if (isAuth) {
        const user_id = req.session.User._id




        let Item_Count = 0;
        let TotalPrice = 0;
        let wishlist_count = 0;
        let Price = 0


        const my_cart = await cart.findOne({ user_Id: user_id })
        let product_Count;
        if (my_cart && my_cart.items) {
          let product_items = my_cart.items;
          product_Count = product_items.length;

          let Prices = [];
          for (let item of product_items) {
            let item_quantity = item.Quantity

            let product_id = item.product_Id;

            const product = await products.findOne({ _id: product_id });
            if (product) {

              Price = product.price * item_quantity

              Prices.push(Price);
            }
          }
          Item_Count = product_items.reduce((acc, i) => acc + i.Quantity, 0)


          TotalPrice = Prices.reduce((acc, price) => acc + price, 0);
        }

        const Cart = await cart.find({ user_Id: user_id })

        const wishlist = await Wishlist.findOne({ user_Id: user_id })

        if (wishlist && wishlist.products) {
          wishlist_count = wishlist.products.length;
        }

        const USER = await User.findOne({ _id: user_id })
        let user_address
        const Address = await address.findOne({ user_Id: user_id })
      
       

        user_address = Address 
        

        return res.render("user_Account", { isAuth, USER, user_address, Products, Categories, Cart, Item_Count, TotalPrice, wishlist_count })
      }
      return res.redirect('/electro')

    }
    catch (error) {
      console.log("in user_account", error.message)
      return res.redirect("/error_found")


    }
  },

  get_category: (req, res) => {
    res.render("category")
  },

  get_store: async (req, res) => {
    try {

      console.log("query:", req.query)

      let Item_Count = 0;
      let TotalPrice = 0;
      let wishlist_count = 0;
      let Price = 0;


      const category_id = req.params.id;
      const Products = await products.find({ category_Id: category_id }).populate("category_Id", 'name').limit(5)
      // console.log("cat_pro---", Products)
      const Categories = await categories.find();
      const isAuth = req.session.isAuth;
     
      const cart_products = await products.find()

      if (isAuth) {
        let user_id = req.session.User._id;
        const my_cart = await cart.findOne({ user_Id: user_id })

        if (my_cart && my_cart.items) {
          let product_items = my_cart.items;
          product_Count = product_items.length;

          let Prices = [];
          for (let item of product_items) {
            let item_quantity = item.Quantity


            let product_id = item.product_Id;

            const product = await products.findOne({ _id: product_id })
            if (product) {

              Price = product.price * item_quantity

              Prices.push(Price);
            }
          }
          Item_Count = product_items.reduce((acc, i) => acc + i.Quantity, 0)

          TotalPrice = Prices.reduce((acc, price) => acc + price, 0);
        }


        const wishlist = await Wishlist.findOne({ user_Id: user_id })
        if (wishlist && wishlist.products) {
          wishlist_count = wishlist.products.length;
        }
        const Cart = await cart.find({ user_Id: user_id });

        const USER = await User.findOne({ _id: user_id })


        return res.render("store", { isAuth, USER, Products, Categories, Cart, Item_Count, TotalPrice, wishlist_count ,cart_products});
      }

      return res.render("store", { isAuth, Products, Categories });
    } catch (error) {
      // Handle any errors that occur during the async operations
      console.log(error.message);
      return res.redirect("/error_found")



    }




  },

  get_new_arrivals: async (req, res) => {

    try {
      let Item_Count = 0;
      let TotalPrice = 0;
      let wishlist_count = 0;
      let Price = 0;


      const category_id = req.params.id;
      const Products = await products.find();

      const new_products = await products.find().sort({ createdAt: -1 }).populate('category_Id', ' name _id').limit(5)
      // console.log("recent_products", new_products)
      const Categories = await categories.find();
      const isAuth = req.session.isAuth;


      if (isAuth) {
        let user_id = req.session.User._id;
        const my_cart = await cart.findOne({ user_Id: user_id })

        if (my_cart && my_cart.items) {
          let product_items = my_cart.items;
          product_Count = product_items.length;

          let Prices = [];
          for (let item of product_items) {
            let item_quantity = item.Quantity


            let product_id = item.product_Id;

            const product = await products.findOne({ _id: product_id });
            if (product) {

              Price = product.price * item_quantity

              Prices.push(Price);
            }
          }
          Item_Count = product_items.reduce((acc, i) => acc + i.Quantity, 0)

          TotalPrice = Prices.reduce((acc, price) => acc + price, 0);
        }


        const wishlist = await Wishlist.findOne({ user_Id: user_id })
        if (wishlist && wishlist.products) {
          wishlist_count = wishlist.products.length;
        }
        const Cart = await cart.find({ user_Id: user_id });

        const USER = await User.findOne({ _id: user_id })


        return res.render("New_Arrivals", { isAuth, USER, new_products, Products, Categories, Cart, Item_Count, TotalPrice, wishlist_count });
      }

      return res.render("New_Arrivals", { isAuth, new_products, Products, Categories });
    } catch (error) {
      // Handle any errors that occur during the async operations
      console.log(error.message);
      return res.redirect("/error_found")



    }



  },

  filter_ByPrice: async (req, res) => {
    // console.log(req.query)
    try {
      const { price_min, price_max } = req.query
      category_id = req.params.id
      

      if (category_id) {
        const filtered_products = await products.find({ $and: [{ category_Id: ObjectId.createFromHexString(category_id), price: { $lte: price_max } }, { price: { $gte: price_min } },] }).populate('category_Id', 'name').limit(2)
        
        if (filtered_products) {
          res.json({ filtered_products })
        }
      }



    }
    catch (error) {
      console.log("errorfiltering:", error.message)
    }
  },

  filter_AllProducts_ByPrice: async (req, res) => {
    try {
      const { price_min, price_max } = req.query
      category_id = req.params.id
      const filtered_all_products = await products.find({ $and: [{ price: { $lte: price_max } }, { price: { $gte: price_min } },] }).populate('category_Id', 'name').limit(2)

      if (filtered_all_products) {
        return res.json({ filtered_all_products })
      }
    }
    catch (error) {
      console.log(error.message)
      return res.redirect("/error_found")

    }
  },

  pagination_In_new_Arrivals: async (req, res) => {
    try {
      Limit = 5
      const { value} = req.query
      let Skip = (value - 1) * Limit
      let limited_products = await products.find().sort({ createdAt: -1 }).populate('category_Id', ' name _id').limit(Limit).skip(Skip)
      
      return res.json({ limited_products })

    } catch (error) {
      console.log(error.message)
    }
  },



  pagination_In_uniqueCategory: async (req, res) => {
    Limit = 5
    const { value, cat_Id } = req.query
    let Skip = (value - 1) * Limit
    if (cat_Id) {
      console.log("", cat_Id)
      let limited_products = await products.find({ category_Id: cat_Id }).populate('category_Id', ' name _id').limit(Limit).skip(Skip)
      console.log("limited:", limited_products)
      return res.json({ limited_products })
    }
  },


  get_product: async (req, res) => {
    try {
      let Item_Count = 0;
      let TotalPrice = 0;
      let wishlist_count = 0;
      let exist_in_wishlist = {}
      let Price = 0;

      const product = req.session.product_detail
      const Products = await products.find()
      const Categories = await categories.find()
      const SubCategories = await subcategories.find()
      let Product_id = req.params.id
      const Product = await products.findOne({ _id: Product_id }).populate('category_Id', 'name')
      let related_products = await products.find({ $and: [{ _id: { $ne: Product._id } }, { category_Id: Product.category_Id }] })
      const isAuth = req.session.isAuth

      if (isAuth) {
        let user_id = req.session.User._id
        const my_cart = await cart.findOne({ user_Id: user_id })

        if (my_cart && my_cart.items) {
          let product_items = my_cart.items;
          product_Count = product_items.length ?? false;

          let Prices = [];
          for (let item of product_items) {
            let item_quantity = item.Quantity

            let product_id = item.product_Id;

            const product = await products.findOne({ _id: product_id });
            if (product) {

              Price = product.price * item_quantity

              Prices.push(Price);
            }
          }
          Item_Count = product_items.reduce((acc, i) => acc + i.Quantity, 0)

          TotalPrice = Prices.reduce((acc, price) => acc + price, 0);
        }


        const Cart = await cart.find({ user_Id: user_id })


        const wishlist = await Wishlist.findOne({ user_Id: user_id })
        if (wishlist && wishlist.products) {
          wishlist_count = wishlist.products.length;


        }

        let customer_review = await reviews.findOne({ product: Product_id }).populate('user', ' firstname lastname email')

        let exist_incart = await cart.findOne({ user_Id: user_id })
        let incart;
        if (exist_incart) {


          let exist_cart = exist_incart.items.find((item) => {
            return item.product_Id == Product_id
          })
          incart = exist_cart ?? false;
        }
        const USER = await User.findOne({ _id: user_id })

        exist_in_wishlist = await Wishlist.findOne({ user_Id: user_id, 'products.product_Id': Product_id })
        let review =  await reviews.findOne({product_Id:Product_id})


        return res.render("product", { product, isAuth, related_products, USER, Products, Categories, Product, SubCategories, Cart, Item_Count, TotalPrice, wishlist_count, customer_review, incart, exist_in_wishlist,review })
      }
      return res.render("product", { product, isAuth, related_products, Products, Categories, Product, SubCategories })


    }
    catch (error) {
      console.log("Error Occured :", error.message)
      return res.redirect("/error_found")


    }
  },

  get_wishlist: async (req, res) => {
    try {
      const Products = await products.find();
      const Categories = await categories.find();
      const isAuth = req.session.isAuth;

      if (isAuth) {
        let user_id = req.session.User._id;
        let my_cart = await cart.findOne({ user_Id: user_id });

        let Item_Count = 0;
        let TotalPrice = 0;
        let product_Count;
        let Price = 0;


        if (my_cart && my_cart.items) {
          let product_items = my_cart.items;
          product_Count = product_items.length;

          let Prices = [];
          for (let item of product_items) {
            let item_quantity = item.Quantity


            let product_id = item.product_Id;

            const product = await products.findOne({ _id: product_id });
            if (product) {

              Price = product.price * item_quantity


              Prices.push(Price);
            }
          }
          Item_Count = product_items.reduce((acc, i) => acc + i.Quantity, 0)

          TotalPrice = Prices.reduce((acc, price) => acc + price, 0);
        }

        const Cart = await cart.find({ user_Id: user_id });
        const wishlist = await Wishlist.find({ user_Id: user_id });
        let wishlist_items = await Wishlist.findOne({ user_Id: user_id });
        let wishlist_count = wishlist_items ? wishlist_items.products.length : 0;

        const USER = await User.findOne({ _id: user_id })


        return res.render("wishlist", { isAuth, USER, Products, Categories, Cart, Item_Count, TotalPrice, wishlist, wishlist_count });
      }

      return res.redirect("/electro");
    } catch (error) {
      console.error("Error fetching wishlist data:", error.message);
      return res.redirect("/error_found")



    }

  },

  iswishlistEmpty: async (req, res) => {
    try {
        let user_Id = req.session.User._id;
        
        // Find the user's wishlist
        let wishlist = await Wishlist.findOne({ user_Id: user_Id });
      console.log(wishlist)   
        // Check if the wishlist exists and if it's empty
        if (!wishlist  ) {
          console.log("why")
         res.json({ success: true });
        } 
    } catch (error) {
        console.error("Error checking wishlist:", error);
      
    }
},



  get_cartPage: async (req, res) => {
    try {
      const Products = await products.find()
      const Categories = await categories.find()
      const isAuth = req.session.isAuth

      if (isAuth) {

        let Item_Count = 0;
        let TotalPrice = 0;
        let wishlist_count = 0;
        let Price = 0;


        let user_id = req.session.User._id
        const my_cart = await cart.findOne({ user_Id: user_id })
        let product_items

        if (my_cart && my_cart.items) {
          product_items = my_cart.items;
          product_Count = product_items.length ?? false;

          let Prices = [];
          for (let item of product_items) {
            let item_quantity = item.Quantity

            let product_id = item.product_Id;

            const product = await products.findOne({ _id: product_id });
            if (product) {

              Price = product.price * item_quantity


              Prices.push(Price);
            }
          }
          Item_Count = product_items.reduce((acc, i) => acc + i.Quantity, 0)



          TotalPrice = Prices.reduce((acc, price) => acc + price, 0);
        }
       

        let Cart = await cart.find({ user_Id: user_id })



        const wishlist = await Wishlist.findOne({ user_Id: user_id })
        if (wishlist && wishlist.products) {
          wishlist_count = wishlist.products.length;
        }
        const USER = await User.findOne({ _id: user_id })


        return res.render("cart", { isAuth, USER, Products, Categories, Cart, Item_Count, TotalPrice, wishlist_count })
      }
      return res.redirect("/electro")


    }
    catch (error) {

      console.log("cartpage occurs error:", error.message)
    


    }
  },
  isCartEmpty:async (req,res)=>{
    let user_Id = req.session.User._id
    const CartisEmpty = await cart.findOne({ user_Id: user_Id });
    console.log(CartisEmpty)
   if( CartisEmpty.items.length === 0)
   {
   
    return res.json({success:true})
   }
  },


  get_checkout: async (req, res) => {
    try {
      let Price = 0;


      console.log(req.params._id)

      const Products = await products.find()
      const Categories = await categories.find()
      const isAuth = req.session.isAuth

      if (isAuth) {

        // let Product_Id = req.params.id
        let user_id = req.session.User._id
         let wishlist_count 
        const my_cart = await cart.findOne({ user_Id: user_id })
  
        if (my_cart && my_cart.items) {
          let product_items = my_cart.items;
          product_Count = product_items.length;

          let Prices = [];
          for (let item of product_items) {
            let item_quantity = item.Quantity

            let Product_id = item.product_Id;

            const product = await products.findOne({ _id: Product_id });
            if (product) {

              Price = product.price * item_quantity


              Prices.push(Price);
            }
          }
          Item_Count = product_items.reduce((acc, i) => acc + i.Quantity, 0)

          TotalPrice = Prices.reduce((acc, price) => acc + price, 0);
        }

        const Cart = await cart.find({ user_Id: user_id })
        const wishlist = await Wishlist.findOne({ user_Id: user_id })
        if(wishlist && wishlist.products.length >0)
        {

         wishlist_count = wishlist.products.length
        }
        const USER = await User.findOne({ _id: user_id })


        let { product_to_buy_qty, pid } = req.query
        // let product_buy;
        let buy_product = [];
        let address_to_deliver;
        let tPrice_tobuy = []
        let total_price_tobuy;
        let t_qty = [];
        let total_Qty_tobuy;
        let pro_qty ;

        console.log("is session true?:::", req.session.is_to_Purchase)


        if (req.session.is_to_Purchase) {
          let product_to_buy = await cart.aggregate([{ $match: { user_Id: ObjectId.createFromHexString(user_id) } }, { $unwind: '$items' }, {
            $lookup: {
              from: 'products',
              localField: 'items.product_Id',
              foreignField: '_id',
              as: 'cart_item'
            }
          },
          {
            $unwind: '$cart_item'
          },

          ])
          console.log("po--------",product_to_buy)
          for (let i of product_to_buy) {
            buy_product.push({
              cart_item: i.cart_item,
              items: i.items
          });
            tPrice_tobuy.push(i.cart_item.price)
            t_qty.push(i.items.Quantity)
            pro_qty = i.items.Quantity
          
          }
          total_price_tobuy = tPrice_tobuy.reduce((acc, price) => acc + price, 0)
          total_Qty_tobuy = t_qty.reduce((acc, qty) => acc + qty, 0)



          address_to_deliver = await address.findOne({ user_Id: user_id }).populate('user_Id', 'firstname lastname email Phone_Number')
         console.log(buy_product)

        }
        else {

          let product_buy = await products.findOne({ _id: pid })

          total_price_tobuy = product_buy.price * product_to_buy_qty

          total_Qty_tobuy = product_to_buy_qty

          console.log("qty3:", total_price_tobuy)

          buy_product.push(product_buy)

          pro_qty =  product_to_buy_qty

          address_to_deliver = await address.findOne({ user_Id: user_id }).populate('user_Id', 'firstname lastname email Phone_Number')
         

        }
        return res.render("checkout", { isAuth, USER, Products, Categories, Cart, Item_Count, TotalPrice, wishlist_count, buy_product, total_price_tobuy, total_Qty_tobuy, address_to_deliver })
      }
      return res.redirect("/electro")

    }
    catch (error) {
      console.log("Error Occured in checkout page :", error.message)
      // return res.redirect("/error_found")


    }
  },





  add_to_Checkout: async (req, res) => {
    try {
      req.session.is_to_Purchase = true
      if (req.session.is_to_Purchase) {
        return res.json({ success: true   })
      }
    }
    catch (error) {
      console.log(error)
    }
  },

  get_payment_page:async(req,res)=>{
    try {

      let Price = 0;
      const Products = await products.find()
      const Categories = await categories.find()
      const isAuth = req.session.isAuth




      if (isAuth) {
        let user_id = req.session.User._id
        const my_cart = await cart.findOne({ user_Id: user_id })


        if (my_cart && my_cart.items) {
          let product_items = my_cart.items;
          product_Count = product_items.length;

          let Prices = [];
          for (let item of product_items) {
            let item_quantity = item.Quantity
            let product_id = item.product_Id;

            const product = await products.findOne({ _id: product_id });
            if (product) {

              Price = product.price * item_quantity
              Prices.push(Price);
            }
          }
          Item_Count = product_items.reduce((acc, i) => acc + i.Quantity, 0)

          TotalPrice = Prices.reduce((acc, price) => acc + price, 0);
        }

        const Cart = await cart.find({ user_Id: user_id })

        const wishlist = await Wishlist.findOne({ user_Id: user_id })
        let wishlist_count = wishlist.products.length

        const USER = await User.findOne({ _id: user_id })



        return res.render("order_payment", { isAuth, USER, Products, Categories, Cart, Item_Count, wishlist_count, TotalPrice })
      }
      return res.render("order_payment", { isAuth, Products, Categories })


    } catch (error) {
      console.log(error.message)
      return res.redirect("/error_found")
    }

  },



  get_Ordered_Products:async(req,res)=>{
    try {
   
    
      const Products = await products.find()
      const Categories = await categories.find()
      const isAuth = req.session.isAuth

      if (isAuth) {

        let Item_Count = 0;
        let TotalPrice = 0;
        let wishlist_count = 0;
        let Price = 0;


        let user_id = req.session.User._id
        const Ordered_Products = await orders.aggregate([
          { $match: { userId: mongoose.Types.ObjectId.createFromHexString(user_id) } },
          {
              $lookup: {
                  from: 'products',
                  localField: 'products.product_Id',
                  foreignField: '_id',
                  as: 'ordered_items'
              }
          },
          { $unwind: '$ordered_items' },
        
      ])
      // console.log(Ordered_Products)
     let pro_and_qty;
        for(let item of Ordered_Products){
          pro_and_qty = item.products
        
        }
       
        const my_cart = await cart.findOne({ user_Id: user_id })
        let product_items

        if (my_cart && my_cart.items) {
          product_items = my_cart.items;
          product_Count = product_items.length ?? false;

          let Prices = [];
          for (let item of product_items) {
            let item_quantity = item.Quantity

            let product_id = item.product_Id;

            const product = await products.findOne({ _id: product_id });
            if (product) {

              Price = product.price * item_quantity


              Prices.push(Price);
            }
          }
          Item_Count = product_items.reduce((acc, i) => acc + i.Quantity, 0)



          TotalPrice = Prices.reduce((acc, price) => acc + price, 0);
        }

        let Cart = await cart.find({ user_Id: user_id })



        const wishlist = await Wishlist.findOne({ user_Id: user_id })
        if (wishlist && wishlist.products) {
          wishlist_count = wishlist.products.length;
        }
        const USER = await User.findOne({ _id: user_id })


        return res.render("Order_listing", { isAuth, USER, Products, Categories, Cart, Item_Count, TotalPrice, wishlist_count ,Ordered_Products,pro_and_qty})
      }
      return res.redirect("/electro")


    }
    catch (error) {

      console.log("cartpage occurs error:", error.message)
    


    }
  },

  Order_Tracking_page :async(req,res)=>{
    try{
    const {Item_Id,Address_id,order_Id} = req.query
    const Products = await products.find()
    const Categories = await categories.find()
    const isAuth = req.session.isAuth
    if (isAuth) {

      let Item_Count = 0;
      let TotalPrice = 0;
      let wishlist_count = 0;
      let Price = 0;


      let user_id = req.session.User._id
     
   let  delivery_item =  await    products.findById(Item_Id)

   let delivery_address =  await address.findOne({user_Id:user_id})

   let order = await orders.findById(order_Id)
  
   const deliveryDays = 7;
   const deliveryDate = new Date(order.date);
   deliveryDate.setDate(deliveryDate.getDate() + deliveryDays);




   let Address_for_Delivery = delivery_address.Addresses.filter((adres)=>adres._id.toString() === Address_id.toString())
    console.log(Address_for_Delivery)
   
      const my_cart = await cart.findOne({ user_Id: user_id })
      let product_items

      if (my_cart && my_cart.items) {
        product_items = my_cart.items;
        product_Count = product_items.length ?? false;

        let Prices = [];
        for (let item of product_items) {
          let item_quantity = item.Quantity

          let product_id = item.product_Id;

          const product = await products.findOne({ _id: product_id });
          if (product) {

            Price = product.price * item_quantity


            Prices.push(Price);
          }
        }
        Item_Count = product_items.reduce((acc, i) => acc + i.Quantity, 0)

        TotalPrice = Prices.reduce((acc, price) => acc + price, 0);
      }

      let Cart = await cart.find({ user_Id: user_id })

      const wishlist = await Wishlist.findOne({ user_Id: user_id })
      if (wishlist && wishlist.products) {
        wishlist_count = wishlist.products.length;
      }
      const USER = await User.findOne({ _id: user_id })

    let review =  await reviews.findOne({product_Id:Item_Id})
    console.log(review)
    return res.render("Track_Order_Page", { isAuth, USER, Products, Categories, Cart, Item_Count, TotalPrice, wishlist_count ,Address_for_Delivery,delivery_item,order,deliveryDate,review})
    }
    return res.redirect("/electro")


  }
  catch (error) {

    console.log("track occurs error:", error.message)
  


  }
  },
  get_contact_us_page: async (req, res) => {
    try {

      let Price = 0;
      const Products = await products.find()
      const Categories = await categories.find()
      const isAuth = req.session.isAuth

      if (isAuth) {
        let user_id = req.session.User._id
        const my_cart = await cart.findOne({ user_Id: user_id })

        if (my_cart && my_cart.items) {
          let product_items = my_cart.items;
          product_Count = product_items.length;

          let Prices = [];
          for (let item of product_items) {
            let item_quantity = item.Quantity
            let product_id = item.product_Id;

            const product = await products.findOne({ _id: product_id });
            if (product) {

              Price = product.price * item_quantity
              Prices.push(Price);
            }
          }
          Item_Count = product_items.reduce((acc, i) => acc + i.Quantity, 0)

          TotalPrice = Prices.reduce((acc, price) => acc + price, 0);
        }

        const Cart = await cart.find({ user_Id: user_id })

        const wishlist = await Wishlist.findOne({ user_Id: user_id })
        let wishlist_count = wishlist.products.length

        const USER = await User.findOne({ _id: user_id })



        return res.render("Contact_us", { isAuth, USER, Products, Categories, Cart, Item_Count, wishlist_count, TotalPrice ,Ordered_Product})
      }
      return res.render("Contact_us", { isAuth, Products, Categories })


    } catch (error) {
      console.log(error.message)
      return res.redirect("/error_found")
    }
  },


  update_user_profileInfo: async (req, res) => {
    try {
      const user_id = req.session.User._id
      console.log(user_id)
      const { firstname, lastname, email, mobno } = req.body
      let profile_updated = await User.updateOne({ _id: user_id }, { $set: { firstname: firstname, lastname: lastname, email: email, Phone_Number: mobno } })
      console.log(profile_updated)
      if (profile_updated.modifiedCount === 1) {
        return res.json({ success: true })

      }
    }
    catch (error) {
      console.log(error.message)
      return res.redirect("/error_found")

    }
  },

  manage_address: async (req, res) => {
    try {
      const user_id = req.params.id
      let Address_exist = await address.findOne({ user_Id: user_id })
      console.log("address:", Address_exist)
      if (!Address_exist) {
        return res.json({ message: "add new address" })
      }
      else {
        return res.json({ message: "already added address" })


      }
    }
    catch (error) {
      console.log(error.message)
      res.redirect("/error_found")


    }

  },

  Add_New_Address: async (req, res) => {
    try {

      console.log('starting add address')
      let user_Id = req.session.User._id
      const { house_name, street, Area, pincode, landmark, district, state, address_type } = req.body
      let Address = await address.findOne({ user_Id: user_Id })
      if (!Address) {
        Address = new address({ user_Id: user_Id, Addresses: [] })
      }
      Address.Addresses.push({
        house_name: house_name,
        street: street,
        area:Area,
        pincode: pincode,
        landmark: landmark,
        district: district,
        state: state,
        address_type: address_type,

      })
      const added_address =  Address.save()

      if (added_address) {
        return res.json({ message: "added address" })
      }

    }
    catch (error) {
      console.log(error.message)
      return res.redirect("/error_found")

    }

  },

  Update_Address: async (req, res) => {
    try {

      let address_id = req.params.id

      const { house_name, street, Area, pincode, landmark, district, state, address_type } = req.body

      const updated = await address.updateOne({'Addresses._id':address_id  }, { $set:{'Addresses.$': { house_name: house_name, street: street, area: Area, pincode: pincode, landmark: landmark, district: district, state: state, address_type: address_type }} })
         console.log(updated)
      if (updated.modifiedCount === 1) {
        res.json({ success: true })

      }
    }
    catch (error) {
      console.log(error.message)
      res.redirect("/error_found")

    }
  },

  delete_address: async (req, res) => {
    try {
     let  address_Id = req.params.id
      console.log("req_body----------",req.body)
      const {house_name, street, Area,pincode ,landmark ,district,state,address_type}=req.body
      const deleted = await address.updateOne({'Addresses._id':address_Id},{$pull:{Addresses:{ house_name: house_name, street: street, area: Area, pincode: pincode, landmark: landmark, district: district, state: state, address_type: address_type }}})
      console.log("delete",deleted)
      if (deleted) {
        return res.json({ success: true })

      }
    }
    catch (error) {
      console.log("error in delete",error.message)
      return res.redirect("/error_found")

    }


  },


  get_RateReview_Page :async (req,res)=>{
    try{
    
      const Products = await products.find()
      const Categories = await categories.find()
      const isAuth = req.session.isAuth
  
      if (isAuth) {
  
        let Item_Count = 0;
        let TotalPrice = 0;
        let wishlist_count = 0;
        let Price = 0;
  
  
        let user_id = req.session.User._id
      //
        const my_cart = await cart.findOne({ user_Id: user_id })
        let product_items
  
        if (my_cart && my_cart.items) {
          product_items = my_cart.items;
          product_Count = product_items.length ?? false;
  
          let Prices = [];
          for (let item of product_items) {
            let item_quantity = item.Quantity
  
            let product_id = item.product_Id;
  
            const product = await products.findOne({ _id: product_id });
            if (product) {
  
              Price = product.price * item_quantity
  
  
              Prices.push(Price);
            }
          }
          Item_Count = product_items.reduce((acc, i) => acc + i.Quantity, 0)
  
  
  
          TotalPrice = Prices.reduce((acc, price) => acc + price, 0);
        }
  
        let Cart = await cart.find({ user_Id: user_id })
  
  
  
        const wishlist = await Wishlist.findOne({ user_Id: user_id })
        if (wishlist && wishlist.products) {
          wishlist_count = wishlist.products.length;
        }
        const USER = await User.findOne({ _id: user_id })
        
        // let customer_review = await reviews.findOne({ product: Product_id }).populate('user', ' firstname lastname email')
     console.log(req.params.id)
       
   const product_id = req.params.id
  
        return res.render("Rate_Review", { isAuth, USER, Products, Categories, Cart, Item_Count, TotalPrice, wishlist_count,product_id})
      }
      return res.redirect("/electro")
  
  
    }
    catch (error) {
  
      console.log("review page occurs error:", error.message)
    
  
  
    }
  
  },

  check_status:async(req,res)=>{
    // console.log(req.params.id)
    let item_Id = req.params.id
    // console.log(req.params.id)
  Item =  await orders.findOne({'products.product_Id':item_Id})
  console.log(Item)
  let Order_Status = Item.status
    res.json({success:true,Order_Status})
  },


  Logout_User: (req, res) => {
    try {

      req.session.destroy((error) => {
        if (error) {
          console.log("error occured:", error.message)
        }
        res.redirect("/electro")
      })

    }
    catch (error) {
      console.log(erro.message)
      res.rediret("/erro_found")
    }
  }

}
