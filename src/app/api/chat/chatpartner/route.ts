import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";



connect()

export async function POST (request  :NextRequest) {
  try {
    
    const reqBody = await request.json()
    const chatPartnerId = reqBody
    const chatPartner = await User.findById(chatPartnerId.chatPartnerId)
    if(!chatPartner) {
      return NextResponse.json({message : 'User not found ' , success : false})
    }
    return NextResponse.json({
      email : chatPartner.email,
      username : chatPartner.username,
      success :true
    })
  } catch (error : any) {
    return NextResponse.json({error : error.message}) 
  }
}