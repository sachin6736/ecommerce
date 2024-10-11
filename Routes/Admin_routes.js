const express =require("express")
const router = express.Router()
const admin_controller =require("../controllers/admin_controller")
const product_controller =require("../controllers/products_controller")
const upload = require("../multer/multer")


// admin handling API

router.get("/admin_page",admin_controller.get_admin_page)
router.get("/admin_home",admin_controller.get_adminHome)
router.get("/admin_profile",admin_controller.get_admin_profile)

// / customer handling API
router.get("/customers",admin_controller.manage_customers)
router.get("/block_user/:_id",admin_controller.block_customers)
router.get("/unblock_user/:_id",admin_controller.unblock_customers)

// / products handling API
router.get("/Add_product",product_controller. get_product_Adding_Page)
router.get("/products",admin_controller.view_products)
router.get("/show_product_details/:_id",admin_controller.show_product_details)
router.get("/orders",admin_controller.manage_orders)
router.get("/logout",admin_controller.logout)


//  categories handling API
router.get("/categories",admin_controller.view_categories)
router.get("/Add_categories",admin_controller.get_category_form)
router.post("/Add_categories",upload.single('image'),admin_controller.add_categories)

// sub_categories handling API

router.post("/Add-subcategory",admin_controller.add_subcategories)
router.get("/set_subcategories/:id",admin_controller.choose_subcategories)
router.put("/edit_category/:id",upload.single('image'),admin_controller.update_category)
router.put("/edit_subcategory/:id",admin_controller.update_subcategory)
router.delete("/delete_subcategory/:id",admin_controller.delete_subcategory)
router.delete("/delete_category/:id",admin_controller.delete_category)

router.post("/order_status_change",admin_controller.change_Ordered_Prodcut_Status)

module.exports= router