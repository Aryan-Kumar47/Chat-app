import { connect } from "@/dbConfig/dbConfig";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import { pusherServer } from "@/lib/pusher";
import { chatHrefConstructor, toPusherKey } from "@/lib/utils";
import Chat from "@/models/chatModel";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";



connect()

export async function POST (request : NextRequest) {
  try {
    const reqBody = await request.json()
    const {requestEmail : emailToAdd} = z.object({requestEmail : z.string()}).parse(reqBody)
    const userId = getDataFromToken(request)
    const user = await User.findById(userId)
    const target = await User.findOne({email : emailToAdd})
    if(!user || !target) {
      return NextResponse.json({message : 'User not found' , success : false})
    }
    const userFriend = user.friends
    let foundInUser = false
    userFriend.map((ele :{requestPending: boolean;email :string} , index : number) => {
      if(ele.email === target.email) {
        foundInUser = true
        if(!ele.requestPending) {
          return NextResponse.json({message : 'Already friends' , success : false})
        }
        user.friends[index].requestPending = false
        return
      }
    })
    const targetFriends = target.friends
    let foundInTarget = false
    targetFriends.map((ele :{requestPending: boolean;email :string} , index : number) => {
      if(ele.email === user.email) {
        foundInTarget = true
        if(!ele.requestPending) {
          return NextResponse.json({message : 'Already friends' , success : false})
        }
        target.friends[index].requestPending = false
        return
      }
    })
    if(!foundInTarget || !foundInUser) {
      return NextResponse.json({message : 'Request not found' , success : false})
    }
    if(foundInTarget && foundInUser) {
      const chatId = chatHrefConstructor(user._id , target._id)
      const chat = await new Chat({
        id : chatId,
      })
      await chat.save()
    }
    user.save()
    target.save()
    await Promise.all([
      pusherServer.trigger(toPusherKey(`user:${userId}:friends`) , 'new_friend' , target),
      pusherServer.trigger(toPusherKey(`user:${target._id}:friends`) , 'new_friend' , user)
    ])
    return NextResponse.json({message :  `${target.username} added as friends` , success : true})
  } catch (error : any) {
    if(error instanceof z.ZodError) {
      return NextResponse.json({error : 'Invalid Request'} , {status : 422})
    }
    return NextResponse.json({error : error.message} , {status : 400})
  }
}