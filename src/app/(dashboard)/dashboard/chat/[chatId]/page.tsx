import ChatInput from '@/components/ChatInput';
import Messages from '@/components/Messages';
import { connect } from '@/dbConfig/dbConfig';
import { Message } from '@/lib/validations/messages';
import Chat from '@/models/chatModel';
import User from '@/models/userModel';
import jwt from 'jsonwebtoken';
import { User2 } from 'lucide-react';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import React, { FC } from 'react';

interface pageProps {
  params : {
    chatId : string
  }
}
connect()

async function getChatMessges(chatId:string) {
  try {
    const chatContainer = await Chat.findOne({id : chatId})
    let chat : Message[] = chatContainer.messages
    chat = JSON.parse(JSON.stringify(chat))
    return chat
  } catch (error) {
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
  const chatPartnerDetail = await User.findById(chatPartnerId)
  if(!chatPartnerDetail) notFound()
  const chatPartner = {
    email : chatPartnerDetail.email,
    username : chatPartnerDetail.username,
    success :true
  }

  const initialMessages : Message[] = await getChatMessges(chatId)

  return (
    <div className='flex-1 justify-between flex flex-col h-full max-h-[calc(100vh-6rem)]'>
      <div className='flex sm:items-center justify-between py-3 border-b-2 border-gray-200'>
        <div className='relative flex items-center space-x-4'>
          <div className='relative'>
            <div className='relative w-8 sm:w-12 h-8 sm:h-12'>
              <User2 className='rounded-full w-8 sm:w-12 h-8 sm:h-12'/>
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
        sessionId={user.id}
        initialMessages={initialMessages}
      />
      <ChatInput chatId={chatId} chatPartner={chatPartner} />
    </div>
  );
};

export default page;