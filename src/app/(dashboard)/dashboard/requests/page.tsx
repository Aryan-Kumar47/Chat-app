import FriendRequests from '@/components/FriendRequests';
import { cookies } from 'next/headers';
import React from 'react';


const page = async() => {
  const cookiesValue = cookies().get('token')
  const jsonString = JSON.stringify(cookiesValue)
  const response = await fetch(`${process.env.DOMAIN}/api/friends/totalrequests` ,{ 
    method: "POST",
    headers: {
    "Content-Type": "application/json",
    "Another-Property": "Something here", },
    cache: 'no-store', 
    body : jsonString
  })
  const jsonData = await response.json()
  const value = jsonData.requests
  const userId = jsonData.user.id
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