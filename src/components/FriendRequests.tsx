'use client'
import { pusherClient } from '@/lib/pusher';
import { toPusherKey } from '@/lib/utils';
import axios from 'axios';
import { Check, Loader2, UserPlus, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { FC, useEffect } from 'react';
import toast from 'react-hot-toast';

interface IncomingFriendRequest {
  email : string,
  username : string,
  id : string
}

interface FriendRequestsProps {
  incomingFriendRequests : IncomingFriendRequest[],
  userId : string
}

interface AxiosData {
  requestId : string,
  requestEmail : string
}


const FriendRequests: FC<FriendRequestsProps> = ({incomingFriendRequests , userId}) => {
  const [friendRequests, setFriendRequests] = React.useState<IncomingFriendRequest[]>(
    incomingFriendRequests
  )
  const [acceptLoader , setAcceptLoader] = React.useState<boolean>(false)
  const [denyLoader , setDenyLoader] = React.useState<boolean>(false)
  const router = useRouter()
  useEffect(() => {
    pusherClient.subscribe(
      toPusherKey(`user:${userId}:incoming_friend_requests`)
    )

    const friendRequestHandler = ({id , email , username} : IncomingFriendRequest) => {
      setFriendRequests((prev) => [...prev , {id, email , username}])
    }
    pusherClient.bind('incoming_friend_requests' , friendRequestHandler)
    return () => {
      pusherClient.unsubscribe(
        toPusherKey(`user:${userId}:incoming_friend_requests`)
      )
        pusherClient.unbind('incoming_friend_requests' , friendRequestHandler)
    }
  },[userId])
  const acceptFriend = async(requestId : string , requestEmail : string) => {
    setAcceptLoader(true)
    const data : AxiosData = {
      requestId : requestId,
      requestEmail : requestEmail
    }
    try {
      const response = await axios.post('/api/friends/accept' , data)
      if(!response.data.success) {
        toast.error(response.data.message)
        return
      }
      setFriendRequests((prev) => prev.filter((request) => request.id !== requestId))
      toast.success(response.data.message)
      router.refresh()
    } catch (error : any) {
      toast.error(error.message)
    } finally {
      setAcceptLoader(false)
    }
  }
  
  const denyFriend = async(requestId :string , requestEmail: string) => {
    setDenyLoader(true)
    const data : AxiosData = {
      requestId : requestId,
      requestEmail : requestEmail
    }
    try {
      const response = await axios.post('/api/friends/deny' , data)
      if(!response.data.success) {
        toast.error(response.data.message)
        return
      }
      setFriendRequests((prev) => prev.filter((request) => request.id !== requestId))
      toast.success(response.data.message)
      router.refresh()
    } catch (error : any) {
      toast.error(error.message)
    } finally {
      setDenyLoader(false)
    }
  } 
  return (
    <>
      {friendRequests.length === 0 ? (
        <p className='text-sm text-zinc-500'>Nothing to show here...</p>
      ) : (
        friendRequests.map((request) => (
          <div key={request.id} className='flex gap-4 items-center'>
            <UserPlus className='text-black' />
            <p className='font-medium text-lg'>{request.email}</p>
            <button
              onClick={() => acceptFriend(request.id , request.email)}
              disabled={acceptLoader}
              aria-label='accept friend'
              className='w-8 h-8 bg-indigo-600 hover:bg-indigo-700 grid place-items-center rounded-full transition hover:shadow-md'>
                {
                  acceptLoader ? 
                  <Loader2 className='font-semibold text-white w-3/4 h-3/4 animate-spin'/>
                  :
                  <Check className='font-semibold text-white w-3/4 h-3/4' />
                }
            </button>

            <button
              onClick={() => denyFriend(request.id , request.email)}
              aria-label='deny friend'
              disabled={denyLoader}
              className='w-8 h-8 bg-red-600 hover:bg-red-700 grid place-items-center rounded-full transition hover:shadow-md'>
                {
                  denyLoader ? 
                  <Loader2 className='font-semibold text-white w-3/4 h-3/4 animate-spin'/>
                  :
                  <X className='font-semibold text-white w-3/4 h-3/4' />
                }
            </button>
          </div>
        ))
      )}
    </>
  );
};

export default FriendRequests;