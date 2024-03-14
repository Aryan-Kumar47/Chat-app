import { connect } from "@/dbConfig/dbConfig";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import { pusherServer } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";
import Chat from "@/models/chatModel";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";


connect()

export async function POST (request : NextRequest) {
  try {
    
    const reqBody = await request.json()
    const {text , chatId} = reqBody
    const encodedToken = request.cookies.get("token")?.value || '';
    const decodedToken : any = jwt.verify(encodedToken , process.env.TOKEN_SECRET!)
    const senderId = decodedToken.id
    const users = chatId.split('--')
    const receiverId = senderId === users[0] ? users[1] : users[0]
    const chatContainer = await Chat.findOne({id : chatId})
    if(!chatContainer) {
      return new Response('Invaild chat' , {status : 404})
    }
    const message = {
      senderId : senderId,
      receiverId : receiverId,
      text : text,
      timeStamp : Date.now()
    }
    await pusherServer.trigger(
      toPusherKey(`chat:${chatId}`),
      'incoming-message',
      message
    )
    await pusherServer.trigger(toPusherKey(`user:${receiverId}:chats`), 'new_message' , {
      ...message,
      // senderImg : ,
      senderName : decodedToken.username
    })
    chatContainer.messages.push(message)
    chatContainer.save()
    return NextResponse.json({status : 204})
  } catch (error : any) {
    return NextResponse.json({error : error.message} , {status : 500})
  }
}