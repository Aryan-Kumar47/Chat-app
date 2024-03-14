import ChatInput from '@/components/ChatInput';
import Messages from '@/components/Messages';
import { Message } from '@/lib/validations/messages';
import jwt from 'jsonwebtoken';
import { User } from 'lucide-react';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import React, { FC } from 'react';

interface pageProps {
  params : {
    chatId : string
  }
}

async function getChatMessges(chatId:string) {
  try {
    const data = JSON.stringify({chatId : chatId})
    const response = await fetch(`${process.env.DOMAIN}/api/chat/getallchat` ,{ 
      method: "POST",
      headers: {
      "Content-Type": "application/json",
      "Another-Property": "Something here", },
      cache: 'no-store', 
      body : data
    })
    const result : Message[] = (await response.json()).messages
    return result
  } catch (error) {
    console.log('in api')
    notFound()
  }
}

const page: FC<pageProps> = async({params} : pageProps) => {
  const {chatId} = params
  const cookiesValue = cookies().get('token')
  const user : any = jwt.verify(cookiesValue?.value! , process.env.TOKEN_SECRET!)
  const [userId1 , userId2] = chatId.split('--')
  if(user.id !== userId1 && user.id !== userId2) {
    notFound()
  }
  const chatPartnerId = user.id === userId1 ? userId2 : userId1
  const chatPartnerJson = JSON.stringify({chatPartnerId : chatPartnerId})
  const chatPartnerResponse =  await fetch(`${process.env.DOMAIN}/api/chat/chatpartner` ,{ 
    method: "POST",
    headers: {
    "Content-Type": "application/json",
    "Another-Property": "Something here", },
    cache: 'no-store', 
    body : chatPartnerJson
  })
  const chatPartner = await chatPartnerResponse.json()

  const initialMessages = await getChatMessges(chatId)
  return (
    <div className='flex-1 justify-between flex flex-col h-full max-h-[calc(100vh-6rem)]'>
      <div className='flex sm:items-center justify-between py-3 border-b-2 border-gray-200'>
        <div className='relative flex items-center space-x-4'>
          <div className='relative'>
            <div className='relative w-8 sm:w-12 h-8 sm:h-12'>
              {/* <Image
                fill
                referrerPolicy='no-referrer'
                src={chatPartner.image}
                alt={`${chatPartner.name} profile picture`}
                className='rounded-full'
              /> */}
              <User className='rounded-full w-8 sm:w-12 h-8 sm:h-12'/>
            </div>
          </div>

          <div className='flex flex-col leading-tight'>
            <div className='text-xl flex items-center'>
              <span className='text-gray-700 mr-3 font-semibold'>
                {chatPartner.username}
              </span>
            </div>

            <span className='text-sm text-gray-600'>
              {chatPartner.email}
            </span>
          </div>
        </div>
      </div>

      <Messages
        chatId={chatId}
        // chatPartner={chatPartner}
        // sessionImg={session.user.image}
        sessionId={user.id}
        initialMessages={initialMessages}
      />
      <ChatInput chatId={chatId} chatPartner={chatPartner} />
    </div>
  );
};

export default page;