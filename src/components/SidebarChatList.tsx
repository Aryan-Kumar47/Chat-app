'use client'
import { pusherClient } from '@/lib/pusher';
import { chatHrefConstructor, toPusherKey } from '@/lib/utils';
import { Message } from '@/lib/validations/messages';
import { usePathname, useRouter } from 'next/navigation';
import React, { FC, useEffect } from 'react';
import toast from 'react-hot-toast';
import UnseenChatToast from './UnseenChatToast';

interface Friends {
  email : string,
  username : string,
  id : string,
  friendId : string,
}
interface SidebarChatListProps {
  friends : Friends[],
  userId : string
}

interface ExtendedMessage extends Message {
  senderImg : string,
  senderName : string
}

const SidebarChatList: FC<SidebarChatListProps> = ({friends , userId}) => {
  const router = useRouter()
  const pathname = usePathname()
  const [unseenMessages , setUnseenMessages] = React.useState<Message[]>([])
  const [activeChats , setActiveChats] = React.useState<Friends[]>(friends)
  useEffect(() => {
    pusherClient.subscribe(toPusherKey(`user:${userId}:chats`))
    pusherClient.subscribe(toPusherKey(`user:${userId}:friends`))

    const newFriendHandler = (newFriend : Friends) => {
      console.log('friend : ' + newFriend)
      setActiveChats((prev) => [...prev , newFriend])
    }
    const chatHandler = (message : ExtendedMessage) => {
      const shouldNotify = pathname !== 
      `/dashboard/chat/${chatHrefConstructor(userId , message.senderId)}`
      if(!shouldNotify) return
      toast.custom((t) => (
        // custom
        <UnseenChatToast
          t={t}
          userId={userId}
          senderId={message.senderId}
          senderName={message.senderName}
          senderMessage={message.text}
          senderImg={message.senderImg}
        />
      ))
      setUnseenMessages((prev) => [...prev , message])
    }

    pusherClient.bind('new_message' , chatHandler)
    pusherClient.bind('new_friend' , newFriendHandler)
    return () => {
      pusherClient.unsubscribe(toPusherKey(`user:${userId}:chats`))
      pusherClient.unsubscribe(toPusherKey(`user:${userId}:friends`))
      pusherClient.unbind('new_message' , chatHandler)
      pusherClient.unbind('new_friend' , newFriendHandler)
    }
  } , [pathname , userId , router])
  useEffect(() => {
    if(pathname?.includes('chat')){
      setUnseenMessages((prev) => {
        return prev.filter((msg) => !pathname.includes(msg.senderId))
      })
    }
  },[pathname])
  return (
    <ul role='list' className='max-h-[25rem] overflow-y-auto -mx-2 space-y-1'>
      {activeChats.sort().map((friend : Friends) => {
        const unseenMessagesCount = unseenMessages.filter((unseenMsg) => {
          return unseenMsg.senderId === friend.friendId
        }).length
        return (
          <li key={friend.id}>
            <a
              href={`/dashboard/chat/${chatHrefConstructor(
                userId,
                friend.friendId
              )}`}
              className='text-gray-700 hover:text-indigo-600 hover:bg-gray-50 group flex items-center gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'>
              {friend.username}
              {unseenMessagesCount > 0 ? (
                <div className='bg-indigo-600 font-medium text-xs text-white w-4 h-4 rounded-full flex justify-center items-center'>
                  {unseenMessagesCount}
                </div>
              ) : null}
            </a>
          </li>
        )
      })}
    </ul>
  );
};

export default SidebarChatList;