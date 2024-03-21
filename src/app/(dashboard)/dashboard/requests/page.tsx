import FriendRequests from '@/components/FriendRequests';
import { cookies } from 'next/headers';
import React from 'react';
import jwt from "jsonwebtoken";
import { totalRequest } from '@/helpers/totalRequest';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';


const page = async() => {
  const session = await getServerSession(authOptions)
  const userId = session?.user.id as string
  const response = await totalRequest(userId)
  const value = response.request
  return (
    <main className='pt-8'>
      <h1 className='font-bold text-5xl mb-8'>Add a friend</h1>
      <div className='flex flex-col gap-4'>
        <FriendRequests
          incomingFriendRequests={value}
          userId={userId}
        />
      </div>
    </main>
  );
};

export default page;