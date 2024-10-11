const express =require("express")
const router = express.Router()
const upload = require('../multer/multer')
const product_controller =require("../controllers/products_controller")


router.get("/Add_product",product_controller.get_product_Adding_Page)
router.post("/Add_product",upload.array('images',20),product_controller.Add_product)
router.get("/update_product/:_id",product_controller.get_update_productpage)
router.post("/update_product/:id",upload.array('images',10),product_controller.update_product_details)
router.delete("/delete_product/:_id",product_controller.delete_product)
router.get("/filter_Admin_product",product_controller.filter_Products)



module.exports = router