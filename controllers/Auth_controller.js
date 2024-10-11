require('dotenv').config();
const User=require("../Model/user_model")
const bcrypt = require("bcrypt")
const categories = require("../Model/categories_model")

const twilio = require('twilio');


const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);


module.exports={
  Send_Otp:async(req,res)=>{
  try{  
  const {phoneNumber} = req.body 
  let phonenum = `+91${phoneNumber}`
  let otp = Math.floor(1000 + Math.random()*9000)
  globalotp = otp
  console.log(globalotp)
twilioClient.messages.create({
  body:`you are created a account in electro ,Your OTP number is ${otp}`,
  to:phonenum,
  from:process.env.TWILIO_PHONE_NUMBER
  })
  .catch((err)=>{
    console.log(err.message)
  })

  }
  catch(error){
    console.log(error.message)
return res.redirect("/error_found")

  }
 

 },
 Verify_otp:(req,res)=>{

try{
  
  const  { otp} = req.body
  let verify_otp = globalotp
  
  console.log("verify:",verify_otp)

   if(otp == verify_otp)
    {
  return  res.json("verified")       
    }
}catch(error){
  console.log(error.message)
return res.redirect("/error_found")

}
 },
     get_signup:async(req,res)=>{
   try{
    const signuperror=req.session.signuperror
    req.session.signuperror =null;
    const isAuth =req.session.isAuth
    const  Categories = await categories.find()
    res.render("signup",{isAuth,signuperror,Categories}) 
  
   }catch(error){
    console.log(error.message)
return res.redirect("/error_found")


   }
    },
    submit_signup : async(req,res)=>{
        try{
        
         const {firstname,lastname,email,phoneNumber,password,confirm_password,}=req.body
         if(firstname ==="",lastname ==="" ,email ==="" ,password ==="",confirm_password ==="",phoneNumber ==="")
          {
            req.session.signuperror="All Fields are Required"
           return  res.redirect("/signup")
          }
         
        const emailregex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const passwordregex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!emailregex.test(email)) {
        req.session.signuperror = "Invalid email ID";
        return res.redirect("/signup");
    }
    if (!passwordregex.test(password)) {
        req.session.signuperror = "Password must contain at least 8 characters, including one uppercase letter, one lowercase letter, one number, and one special character.";
        return res.redirect("/signup");
    }
    if (password !== confirm_password) {
        req.session.signuperror = "Passwords do not match";
        return res.redirect("/signup");
    }
    const userexist=await User.findOne({firstname,email})
    if (userexist)
    {
    req.session.signuperror = "User already exists";
    return res.redirect("/signup");
    }   
    // let Salt = bcrypt.genSalt(10)
    // let  hashedpassword = bcrypt.hash(password,Salt)
    // console.log(hashedpassword)
    await User.create({firstname:firstname,lastname:lastname,email:email,password:password,Phone_Number:phoneNumber})

     return   res.redirect("/login")
       }
       catch(error)
       {
            console.log(error.message)


      }
    },
   
    get_login :async (req,res)=>{
      try{const errmsg=req.session.error
        req.session.error =null
        const isAuth =req.session.isAuth
        const  Categories = await categories.find()
      return  res.render("login",{isAuth,errmsg,Categories}) 
     }
     catch(error)
     {
      console.log(error.message)
return res.redirect("/error_found")



     }
},

login_toaccount :async(req,res)=>{
try{
  const {email,password}=req.body
  if(email ==="",password === "")
    {
      req.session.error = "Email and Password Required"
        return res.redirect("/login")
    }
  const user = await User.findOne({email:email})
  
  if(user.email === email   && user.password !== password )
    {
      req.session.error ="incorrect password"
      return res.redirect("/login")
    }
    

     if(user.role ==="Admin")
      {
         req.session.admin =user

         return  res.redirect("/admin_home")
      }
      if(user.blocked)
        {
        req.session.error ="you are blocked !"
        return res.redirect("/login")
        }     
        else if(user.blocked === false)
        {
          req.session.User  = user
          req.session.isAuth =true;
          return   res.redirect("/electro") 
        
        }               
}
catch(error)
{
  console.log(error.message)


}

},



}