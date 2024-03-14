'use client'
import { pusherClient } from '@/lib/pusher';
import { cn, toPusherKey } from '@/lib/utils';
import { Message } from '@/lib/validations/messages';
import { format } from 'date-fns';
import { User } from 'lucide-react';
import React, { FC, useEffect, useRef, useState } from 'react';

interface MessagesProps {
  initialMessages  : Message[],
  sessionId : string,
  chatId : string
}

const Messages: FC<MessagesProps> = ({
  initialMessages , sessionId , chatId
}) => {
  let scrollDownRef = useRef<HTMLDivElement | null>(null)
  const [messages , setMessages] = useState<Message[]>(initialMessages)
  useEffect(() => {
    pusherClient.subscribe(
      toPusherKey(`chat:${chatId}`)
    )

    const messageHandler = (message : Message) => {
      setMessages((prev) => [...prev , message])
    }
    pusherClient.bind('incoming-message' , messageHandler)
    return () => {
      pusherClient.unsubscribe(
        toPusherKey(`chat:${chatId}`)
      )
        pusherClient.unbind('incoming-message' , messageHandler)
    }
  },[chatId])
  useEffect(() => {
    scrollDownRef.current?.scrollIntoView({behavior : "smooth"})
  },[messages])
  const formatTimestamp = (timestamp : number) => {
    return format(timestamp , 'HH:mm')
  }
  return (
    <div
      id='messages'
      className='flex h-full flex-1 flex-col p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch'>
        {messages.map((message , index) => {
          const isCurrentUser = message.senderId === sessionId
          const hasNextMessageFromSameUser = messages[index -1]?.senderId === messages[index].senderId
          return <div className='chat-message' key={`${message._id}-${message.timeStamp}`}>
            <div className={cn('flex items-start' , {
              'justify-end' : isCurrentUser,
              'mt-4' : !hasNextMessageFromSameUser,
              'mt-1' : hasNextMessageFromSameUser
            })}>
              <div className={cn('flex flex-col space-y-2 text-base max-w-xs mx-2' , {
                'order-1 items-end' : isCurrentUser,
                'order-2 items-start' : !isCurrentUser,
              })}>
                <span
                  className={cn('px-4 py-2 rounded-lg inline-block', {
                    'bg-indigo-600 text-white': isCurrentUser,
                    'bg-gray-200 text-gray-900': !isCurrentUser,
                    'rounded-br-none':
                      !hasNextMessageFromSameUser && isCurrentUser,
                    'rounded-bl-none':
                      !hasNextMessageFromSameUser && !isCurrentUser,
                  })}>
                    {message.text}{' '}
                    <span className='ml-2 text-xs text-gray-400'>
                    {formatTimestamp(message.timeStamp)}
                  </span>
                  </span>
              </div>
              <div
                className={cn('relative w-6 h-6', {
                  'order-2': isCurrentUser,
                  'order-1': !isCurrentUser,
                  invisible: hasNextMessageFromSameUser,
                })}>
                  <User className='w-6 h-6 rounded-full' />
                {/* <Image
                  fill
                  src={
                    isCurrentUser ? (sessionImg as string) : chatPartner.image
                  }
                  alt='Profile picture'
                  referrerPolicy='no-referrer'
                  className='rounded-full'
                /> */}
              </div>
            </div>
          </div>
        })}
        <div ref={scrollDownRef}/>
    </div>
  );
};

export default Messages;