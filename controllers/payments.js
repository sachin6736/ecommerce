const payments=require("../Model/payments_model")

const Razorpay = require("razorpay")

require('dotenv').config();



let payment_gateway =new Razorpay({
    key_id:process.env.Payment_Gateway_Key_Id,
    secret_key:process.env.Payment_Gateway_Secret_Key 
})

payment_gateway.payments.fetch()