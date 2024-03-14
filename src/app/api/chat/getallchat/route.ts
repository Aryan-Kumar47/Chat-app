import { connect } from "@/dbConfig/dbConfig";
import Chat from "@/models/chatModel";
import { NextRequest, NextResponse } from "next/server";


connect()

export async function POST (request : NextRequest) {
  try {
    const reqBody = await request.json()
    const chatId = reqBody.chatId
    const chatContainer = await Chat.findOne({id : chatId})
    if(!chatContainer) {
      return NextResponse.json({messages : []},{status : 404})
    }
    return NextResponse.json({messages : chatContainer.messages})
  } catch (error : any) {
    return NextResponse.json({error : error.messages} , {status : 500})
  }
}