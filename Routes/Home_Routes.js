const express = require('express')
const router = express.Router()
const home_controller =require("../controllers/home_controller")
const cart_controller =require("../controllers/cart")
let wishlist_controller = require("../controllers/wishlist")
let review_controller = require("../controllers/reviews")
let order_controller = require("../controllers/orders")

// home routes
router.get("/search_product",home_controller.Search_Input)
router.get("/electro",home_controller.get_home)
router.get("/category",home_controller.get_category)
router.get("/store/:id",home_controller.get_store)
router.get("/new_products",home_controller.get_new_arrivals)
router.get("/checkout",home_controller.get_checkout)
router.get("/product/:id",home_controller.get_product)
router.get("/cart",home_controller.get_cartPage)
router.get("/wishlist",home_controller.get_wishlist)
router.get("/cart_empty",home_controller.isCartEmpty)
router.get("/wishlist_empty",home_controller.iswishlistEmpty)
router.get("/error_found",home_controller.get_error_page )
router.get("/place_order",home_controller.add_to_Checkout)
router.get("/track_order",home_controller.Order_Tracking_page)

// user profile apis
router.get("/user_Account",home_controller.get_userAccount )
router.put("/change_userinfo/:id",home_controller.update_user_profileInfo)
router.post("/manage_address/:id",home_controller.manage_address)
router.post("/Add_User_Address",home_controller.Add_New_Address)
router.put('/update_user_address/:id',home_controller.Update_Address)
router.delete("/remove_user_address/:id",home_controller.delete_address)




router.get("/contact_us",home_controller.get_contact_us_page )
router.get("/product/store/:id",home_controller.get_store )
router.get("/logout_user",home_controller.Logout_User)


// cart management //
router.post("/add_to_cart/:id",cart_controller.Add_to_Cart)
router.delete("/remove_from_cart/:id",cart_controller.Remove_From_Cart)
router.put("/update_quantity/:id",cart_controller.update_cart_quantity)

router.get("/check_wishlist_icon/:id",wishlist_controller.Manage_Wishlist_icon)
router.post("/add_to_wishlist/:id",wishlist_controller.Add_to_Wishlist)
router.put("/remove_from_wishlst/:id",wishlist_controller.Remove_From_Wishlist)
router.get("/rate_review_product/:id",home_controller.get_RateReview_Page)
router.post("/rate_review_product/:id",review_controller.post_review)


router.get('/store/filter_products_by_price/:id',home_controller.filter_ByPrice)
router.get("/new_products/filter_products_by_price/",home_controller.filter_AllProducts_ByPrice)
router.get("/get_splited_products/",home_controller.pagination_In_new_Arrivals)
router.get("/get_splitted_categorised_product",home_controller.pagination_In_uniqueCategory)

router.get("/payment_page",home_controller.get_payment_page)
router.post('/create_order',order_controller.Order_Product)
router.post("/verify_payment",order_controller.Payment_Verification)
router.get("/list_ordered_products",home_controller.get_Ordered_Products)

router.get("/track_status/:id",home_controller.check_status)


module.exports = router