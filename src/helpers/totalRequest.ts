import { connect } from '@/dbConfig/dbConfig';
import User from '@/models/userModel';
import { notFound } from "next/navigation";


interface TotalRequest {
  email : string,
  username : string,
  image : string,
  id : string,
  friendId : string,
}

export const totalRequest = async (userId : string) => {
  connect()
  const user = await User.findById(userId)
  if(!user) notFound()

  const userFriends = user.friends
    let totalRequest : TotalRequest[] = []
    let totalFriends : TotalRequest[] = []
    userFriends.map((ele: any) => {
      if(ele.requestPending && !ele.sender) totalRequest.push({
        email : ele.email,
        username : ele.username,
        id : ele._id.toString(),
        image : ele.image,
        friendId : ele.friendId
      })
      else if (!ele.requestPending) totalFriends.push({
        email : ele.email,
        username : ele.username,
        id : ele._id.toString()  ,
        image : ele.image,
        friendId : ele.friendId
      })
    })
    return {
      request : totalRequest,
      friends : totalFriends
    }
}