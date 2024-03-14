import { connect } from "@/dbConfig/dbConfig";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import { pusherServer } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";
import { addFriendValidator } from "@/lib/validations/add-friends";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";

connect()

export async function POST (request : NextRequest) {
  try {
    const body = await request.json()
    const {email : emailToAdd} = addFriendValidator.parse(body.email)
    const targetUser = await User.findOne({email : emailToAdd})
    if(!targetUser) {
      return NextResponse.json({message : 'User not found' , success : false})
    }
    const userId = await getDataFromToken(request)
    const user = await User.findById(userId)
    const userFriend = user.friends
    if(user._id.equals(targetUser._id)) {
      return NextResponse.json({message : 'You cannot add yourself as a friend' , success : false})
    }
    if(userFriend.length > 0) {
      const alreadyFriendWith = userFriend.filter((ele: { email: string; }) => ele.email === targetUser.email)
      if(alreadyFriendWith) {
        if(alreadyFriendWith.requestPending) {
          return NextResponse.json({message : 'Already is friend request sent to this user' , success : false})
        }
        else {
          return NextResponse.json({message : 'Already is friends with this user' , success : false})
        }
      }
    }
    await pusherServer.trigger(
      toPusherKey(`user:${targetUser._id}:incoming_friend_requests`),
      'incoming_friend_requests', 
      {
        id : userId,
        email : user.email,
        username : user.username
      })
    
    user.friends.push({email : targetUser.email , username : targetUser.username , requestPending : true , sender : true , friendId : targetUser._id})
    targetUser.friends.push({email : user.email , username : user.username , requestPending : true , sender : false , friendId : user._id})
    await user.save()
    await targetUser.save()
    return NextResponse.json({message : 'friend request sent' , success : true})
  } catch (error:any) {
    return NextResponse.json({error : error.message})
  }
}