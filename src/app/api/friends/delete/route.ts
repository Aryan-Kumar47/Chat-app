import { connect } from "@/dbConfig/dbConfig";
import { getDataFromToken } from "@/helpers/getDataFromToken";
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
        user.friends.splice(index , 1)
        return
      }
    })
    const targetFriends = target.friends
    let foundInTarget = false
    targetFriends.map((ele :{requestPending: boolean;email :string} , index : number) => {
      if(ele.email === user.email) {
        foundInTarget = true
        target.friends.splice(index , 1)
      }
    })
    if(!foundInTarget || !foundInUser) {
      return NextResponse.json({message : 'Friend not found' , success : false})
    }
    user.save()
    target.save()
    return NextResponse.json({message :  `${target.username} added as friends` , success : true})
  } catch (error : any) {
    if(error instanceof z.ZodError) {
      return NextResponse.json({error : 'Invalid Request'} , {status : 422})
    }
    return NextResponse.json({error : error.message} , {status : 400})
  }
}