import { chatHrefConstructor } from '@/lib/utils';
import { Message } from '@/lib/validations/messages';
import { ChevronRight,  User2 } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import Chat from '@/models/chatModel';
import { totalRequest } from '@/helpers/totalRequest';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import Image from 'next/image';



const page = async ({}) => {
  const session = await getServerSession(authOptions)
  const userId = session?.user.id as string
  const response = await totalRequest(userId)
  const friends = response.friends
  const friendsWithLastMessage = await Promise.all(
    friends.map(async (friend : any) => {
      const chatId = chatHrefConstructor(friend.friendId , userId)
      const chatContainer = await Chat.findOne({id : chatId})
      if(!chatContainer) return
      const lastMessage : Message[] = chatContainer.messages[chatContainer.messages.length -1]
      return {
        ...friend,
        lastMessage
      }
    }
  ))

  return (
    <div className='container py-12'>
      <h1 className='font-bold text-5xl mb-8'>Recent chats</h1>
      {friendsWithLastMessage.length === 0 ? (
        <p className='text-sm text-zinc-500'>Nothing to show here...</p>
      ) : (
        friendsWithLastMessage.map((friend) => (
          <div
            key={friend.friendId}
            className='relative bg-zinc-50 border border-zinc-200 p-3 rounded-md'>
            <div className='absolute right-4 inset-y-0 flex items-center'>
              <ChevronRight className='h-7 w-7 text-zinc-400' />
            </div>

            <Link
              href={`/dashboard/chat/${chatHrefConstructor(
                userId,
                friend.friendId
              )}`}
              className='relative sm:flex'>
              <div className='mb-4 flex-shrink-0 sm:mb-0 sm:mr-4'>
                <div className='relative h-6 w-6'>
                <Image
                    referrerPolicy='no-referrer'
                    className='rounded-full'
                    alt={`${friend.name} profile picture`}
                    src={friend.image}
                    fill
                  />
                </div>
              </div>

              <div>
                <h4 className='text-lg font-semibold'>{friend.username}</h4>
                <p className='mt-1 max-w-md'>
                  <span className='text-zinc-400'>
                    {friend.lastMessage.senderId === userId
                      ? 'You: '
                      : ''}
                  </span>
                  {friend.lastMessage.text}
                </p>
              </div>
            </Link>
          </div>
        ))
      )}
    </div>
  );
};

export default page;