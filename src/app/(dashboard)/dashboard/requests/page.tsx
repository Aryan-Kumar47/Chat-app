import FriendRequests from '@/components/FriendRequests';
import { cookies } from 'next/headers';
import React from 'react';
import jwt from "jsonwebtoken";
import { totalRequest } from '@/helpers/totalRequest';


const page = async() => {
  const cookiesValue = cookies().get('token')
  const decodedToken : any = jwt.verify( cookiesValue?.value!, process.env.TOKEN_SECRET!)
  const userId = decodedToken.id
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