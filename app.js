const express=require("express")
const app=express()
const session=require("express-session")
const route=require("./Routes/Auth_routes")
const Admin_route=require("./Routes/Admin_routes")
const product_routes=require("./Routes/product_routes")
const otp_route = require("./Routes/otp_Routes")
const home_routes = require("./Routes/Home_Routes")
const multer = require('multer');
// const upload = multer()
require('dotenv').config();


const mongodbconnect = require("./Database/db")
mongodbconnect()


app.set("view engine" ,"ejs")
app.set("views","views")

app.use(express.json())
app.use(express.urlencoded({extended:true}))
// app.use(upload.none());
app.use(express.static("public"))
app.use(session({
    secret:process.env.SECRET_KEY,
    resave:false,
    saveUninitialized:true,
 
}))


app.use("/",route,Admin_route,product_routes,otp_route,home_routes)
// app.use((req, res, next) => {
//     res.status(404).render('errorPage', {
//       errorCode: 404,
//       errorMessage: 'Page Not Found',
//       errorDetails: 'The page you are looking for does not exist.'
//     });
//   });

//   app.use((err, req, res, next) => {
//     console.error(err.stack);
//     res.status(err.status || 500).render('errorPage', {
//       errorCode: err.status || 500,
//       errorMessage: err.message || 'Internal Server Error',
//       errorDetails: err.details || 'Something went wrong!'
//     });
//   });

app.listen("3000",()=>{
    console.log("server Running on port 3000")
})