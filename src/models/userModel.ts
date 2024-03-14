import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username : {
    type : String,
    required : [true , 'Please provide a username'],
    unique : true
  },
  email  :{
    type : String,
    required : true,
    unique : true,
  },
  password : {
    type : String,
    required : [true , 'Please provide a password']
  },
  isVerfied : {
    type : Boolean,
    default : false,
  },
  friends : [
    {
      email : String,
      username : String,
      requestPending : Boolean,
      sender : Boolean,
      friendId : String,
    }
  ],
  forgotPasswordToken : String,
  forgotPasswordTokenExpiry : Date,
  verifyToken : String,
  verifyTokenExpiry : Date,
})

// first time -> undefined || true -> created 
// second time -> true || will not execute
const User = mongoose.models.User || mongoose.model("User" , userSchema) 
export default User;