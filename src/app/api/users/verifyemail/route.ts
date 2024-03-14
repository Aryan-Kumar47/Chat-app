import { connect } from "@/dbConfig/dbConfig";
import { NextRequest , NextResponse } from "next/server";
import User from "@/models/userModel";

connect()

export async function POST(request:NextRequest) {
  try {
    const reqBody = await request.json()
    const {token} = reqBody
    const user = await User.findOne({verifyToken : token , verifyTokenExpiry : {$gt:Date.now()}}) // $gt greater than
    if(!user) {
      return NextResponse.json({message : "Invalid token" , success : false})
    }
    user.isVerfied = true
    user.verifyToken = undefined
    user.verifyTokenExpiry = undefined
    await user.save()
    return NextResponse.json({
      message : "Email verified successfully",
      success : true
    })
  } catch (error : any) {
    return NextResponse.json({error : error.message} , {status: 500})
  }
}