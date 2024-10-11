const express =require("express")
const router =express.Router()
const Auth_controller =require("../controllers/Auth_controller")



router.get("/signup",Auth_controller .get_signup)
router.post("/signup",Auth_controller .submit_signup)
router.get("/login",Auth_controller .get_login)
router.post("/login",Auth_controller .login_toaccount )


module.exports= router