import ChatInput from '@/components/ChatInput';
import DeleteChatButton from '@/components/DeleteChatButton';
import Messages from '@/components/Messages';
import { connect } from '@/dbConfig/dbConfig';
import { authOptions } from '@/lib/auth';
import { Message } from '@/lib/validations/messages';
import Chat from '@/models/chatModel';
import Users from '@/models/userModel';
import { getServerSession } from 'next-auth';
import Image from 'next/image';
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
    chat = chat.reverse()
    chat = JSON.parse(JSON.stringify(chat))
    return chat
  } catch (error) {
    notFound()
  }
}

const page: FC<pageProps> = async({params} : pageProps) => {
  const {chatId} = params
  const session = await getServerSession(authOptions)
  const userId = session?.user.id
  const [userId1 , userId2] = chatId.split('--')
  if(userId !== userId1 && userId !== userId2) {
    notFound()
  }
  const chatPartnerId = userId === userId1 ? userId2 : userId1
  if(!chatPartnerId) notFound()
  const chatPartnerDetail = await Users.findById(chatPartnerId)
  if(!chatPartnerDetail) notFound()
  const chatPartner = {
    id : chatPartnerDetail.id,
    email : chatPartnerDetail.email,
    username : chatPartnerDetail.name,
    image : chatPartnerDetail.image,
  }

  const initialMessages : Message[] = await getChatMessges(chatId)

  return (
    <div className='flex-1 justify-between flex flex-col h-full max-h-[calc(100vh-6rem)]'>
      <div className='flex sm:items-center justify-between py-3 border-b-2 border-gray-200'>
        <div className='relative flex items-center space-x-4'>
          <div className='relative'>
            <div className='relative w-8 sm:w-12 h-8 sm:h-12'>
            <Image
                fill
                referrerPolicy='no-referrer'
                src={chatPartner.image}
                alt={`${chatPartner.username} profile picture`}
                className='rounded-full'
              />
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
        {/* <DeleteChatButton chatId={chatId}/> */}
      </div>

      <Messages
        chatId={chatId}
        sessionId={userId}
        initialMessages={initialMessages}
        chatPartner={chatPartner}
        sessionImg={session?.user.image}
      />
      <ChatInput chatId={chatId} chatPartner={chatPartner} />
    </div>
  );
};

export default page;