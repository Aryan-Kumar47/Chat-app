import { connect } from "@/dbConfig/dbConfig";
import { sendEmail } from "@/helpers/mailer";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";

connect()

export async function POST (request : NextRequest) {
  try {
    const reqBody = await request.json()
    const {email} = reqBody
    const user = await User.findOne({email : email})
    if(!user){
      return NextResponse.json({message : 'User not exist' , success : false})
    }
    await sendEmail({email , emailType: "RESET", userId: user._id})
    return NextResponse.json({
      message : 'Reset password link send to this email',
      success : true
    })
  } catch (error : any) {
    return NextResponse.json({error : error.message} , {status : 500})
  }
}