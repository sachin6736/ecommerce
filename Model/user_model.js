const mongoose = require('mongoose');

// Connect to MongoDB when this file is required
const userSchema = mongoose.Schema({
    firstname: {
      type: String,
      
    },
    lastname: {
      type: String,
      
    },

    email: {
      type: String,
    
    
    },
    Phone_Number :{
    type:Number,  
    },
    password: {
      type: String,
      
    },
    role: {
      type: String,
      enum: ['User', 'admin'],
      default: 'User'
    },
    blocked: {
      type: Boolean,
      default: false
    }

    
   
  });

  const User=mongoose.model("User",userSchema)
  module.exports=User
  