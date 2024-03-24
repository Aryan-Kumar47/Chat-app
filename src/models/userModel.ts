import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  // username : {
  name : {
    type : String,
    required : [true , 'Please provide a username'],
  },
  email : {
    type : String,
    required : true,
    unique : true,
  },
  image : {
    type :String,
  },
  // password : {
  //   type : String,
  //   required : [true , 'Please provide a password']
  // },
  // isVerfied : {
  //   type : Boolean,
  //   default : false,
  // },
  friends : [
    {
      email : String,
      username : String,
      image : String,
      requestPending : Boolean,
      sender : Boolean,
      friendId : String,
    }
  ],
  // forgotPasswordToken : String,
  // forgotPasswordTokenExpiry : Date,
  // verifyToken : String,
  // verifyTokenExpiry : Date,
})

// first time -> undefined || true -> created 
// second time -> true || will not execute
const Users = mongoose.models.User || mongoose.model("User" , userSchema) 
export default Users;