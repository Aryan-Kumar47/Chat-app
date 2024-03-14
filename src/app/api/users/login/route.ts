import {connect} from '@/dbConfig/dbConfig'
import User from '@/models/userModel'
import { NextRequest , NextResponse } from 'next/server'
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'


connect()

export async function POST(request : NextRequest) {
  try {
    const reqBody = await request.json()
    const {email , password} = reqBody

    // CHECK IF USER EXISTS
    const user = await User.findOne({email})
    if(!user){
      return NextResponse.json({message : "User does not exists" , success : false})
    }
    if(!user.isVerfied) {
      return NextResponse.json({message : "Please verified email" , success : false})
    }
    const validPassword = await bcryptjs.compare(password , user.password)
    if(!validPassword){
      return NextResponse.json({message : "Invalid password" , success : false})
    }
    // CREATE TOKEN DATA -> AND SEND IT TO USER COOKIE
    const tokenData = {
      id : user._id,
      username : user.username,
      email : user.email
    }
    const token = await jwt.sign(tokenData , process.env.TOKEN_SECRET! , {expiresIn : "1d"}) // expires in 1 day
    const response = NextResponse.json({
      message : "Login successful",
      success : true,
    })
    cookies().set('token' , token)
    // response.cookies.set('token' , token ,{
    //   name : 'token',
    //   value : token,
    //   httpOnly : true ,
    // })
    return response
  } catch (error : any) {
    return NextResponse.json({error : error.message}, {status : 500})
  }
}