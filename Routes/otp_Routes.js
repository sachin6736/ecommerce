const auth_controller = require("../controllers/Auth_controller")
const express =require("express")
const router = express.Router()
 
router.post("/send-otp",auth_controller.Send_Otp)

router.post("/verify_otp",auth_controller.Verify_otp)

module.exports=router