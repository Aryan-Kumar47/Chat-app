import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { getDataFromToken } from "@/helpers/getDataFromToken";

connect()

export async function POST(request : NextRequest) {
  try {
    interface TotalRequest {
      email : string,
      username : string,
      id : string,
      friendId : string,
    }
    const reqBody = await request.json()
    const encodedToken = reqBody.value
    const decodedToken : any = jwt.verify(encodedToken , process.env.TOKEN_SECRET!)
    const userId = decodedToken.id
    const user = await User.findById(userId)
    if(!user) return NextResponse.json({message : 'User not found'} , {status : 401})
    const friends = user.friends
    let totalRequest : TotalRequest[] = []
    let totalFriends : TotalRequest[] = []
    friends.map((ele: any) => {
      if(ele.requestPending && !ele.sender) totalRequest.push({
        email : ele.email,
        username : ele.username,
        id : ele._id,
        friendId : ele.friendId
      })
      else if (!ele.requestPending) totalFriends.push({
        email : ele.email,
        username : ele.username,
        id : ele._id  ,
        friendId : ele.friendId
      })
    })
    return NextResponse.json({requests : totalRequest , friends : totalFriends , user : decodedToken})
  } catch (error:any) {
    return NextResponse.json({error : error.message})
  }
}