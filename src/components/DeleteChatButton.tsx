'use client'
import { Loader2, Trash } from 'lucide-react';
import React, { FC } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

interface DeleteChatButtonProps {
  chatId : string
}

const DeleteChatButton: FC<DeleteChatButtonProps> = ({chatId}) => {
  const [isLoading,  setIsLoading] = React.useState<boolean>(false)
  const deleteChatsHandler = async () => {
    try {
      setIsLoading(true)
      await axios.post('/api/chat/delete',{chatId : chatId})
      toast.success('Chat deleted')
    } catch (error) {
      toast.error('Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <section className="flex justify-center items-center mr-10">
      <button
      onClick={deleteChatsHandler}
        disabled={isLoading}
        className="group flex justify-center p-2 rounded-md drop-shadow-xl bg-[#7289da] from-gray-800 to-black text-white font-semibold hover:rounded-[50%] transition-all duration-500 hover:from-[#331029] hover:to-[#310413]"
      >
        {isLoading ? <Loader2 className='animate-spin'/> : <Trash/>}
        <span
          className="pointer-events-none absolute opacity-0 group-hover:opacity-100 group-hover:text-gray-700 group-hover:text-sm group-hover:-translate-y-10 duration-700 text-nowrap"
        >
          Delete Chats
        </span>
      </button>
    </section>

  );
};

export default DeleteChatButton;