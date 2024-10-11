const mongoose =require("mongoose")
require('dotenv').config();

const mongodbconnect=async()=>{
    try{
      await mongoose.connect(process.env.MyDatabase)
           console.log("mongodb successfully connected")
    }
    catch(error)
    {
        console.log("Error Occured :",error.message)
    }

}
module.exports = mongodbconnect