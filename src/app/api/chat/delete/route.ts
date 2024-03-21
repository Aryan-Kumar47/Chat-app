import { connect } from "@/dbConfig/dbConfig";
import { pusherServer } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";
import Chat from "@/models/chatModel";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";


connect()

export async function POST (request : NextRequest) {
  try {
    const reqBody = await request.json()
    const {chatId} = reqBody
    const session = await getServerSession(authOptions)
    const chatContainer = await Chat.findOne({id : chatId})
    if(!chatContainer) {
      return NextResponse.json({message : 'Invaild chat'} , {status : 404})
    }
    chatContainer.messages.splice(0, chatContainer.messages.length)
    await pusherServer.trigger(
      toPusherKey(`chat:${chatId}`),
      'incoming-message',
      {}
    )
    chatContainer.save()
    return NextResponse.json({status : 200})
    // return NextResponse.json({message : 'Chats deleted'},{status : 204})
  } catch (error : any) {
    console.log('error')
    return NextResponse.json({error : error.message} , {status : 500})
  }
}