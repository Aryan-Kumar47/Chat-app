"use client"

import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react';
import toast from 'react-hot-toast';

const Page = () => {
  const router = useRouter()
  interface User {
    email : string,
    password : string,
    username : string
  }
  const [user , setUser] = React.useState<User>({
    email : "",
    password : "",
    username : "",
  })

  const changeHandler = (e : React.ChangeEvent<HTMLInputElement>) => {
    setUser({...user , [e.target.name] : e.target.value})
  }

  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  async function sumbitHandler(e: React.FormEvent<HTMLFormElement>) {
    try {
      setIsLoading(true)
      e.preventDefault()
      const response = await axios.post('api/users/signup' , user)
      if(!response.data.success) {
        throw new Error(response.data.message)
      }
      toast.success(response.data.message)
      router.push('/login')
    } catch (error : any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <div className='flex h-screen items-center justify-center py-12 px-4 sm:px-6 lg:px-8'>
      <div className="bg-white lg:w-4/12 md:6/12 w-10/12 m-auto my-10 shadow-md">
        <div className="py-8 px-8 rounded-xl">
          <div className='flex flex-col items-center'>
            <h2 className=' text-center text-3xl font-bold tracking-tight text-gray-900'>
              Signup
            </h2>
          </div>
          <form onSubmit={sumbitHandler} className="mt-6">
            <div className="my-5 text-sm">
            <Input 
            placeholder='Username'
            type="text"
            id="username"
            name="username"
            value={user.username}
            onChange={changeHandler}
            required
            autoFocus
            >
            Username
            </Input>
            <Input 
            placeholder='Email'
            type="email"
            id="email"
            name="email"
            value={user.email}
            onChange={changeHandler}
            required
            >
            Email
            </Input>
            </div>
            <div className="my-5 text-sm">
              <Input 
              placeholder='Password'
              type="password"
              id="password"
              name="password"
              value={user.password}
              onChange={changeHandler}
              required
              >
              Password
              </Input>
            </div>

            <Button
              isLoading={isLoading}
              type='submit'
              className='max-w-sm mx-auto w-full'
              >
              Login
            </Button>
          </form>
          <p className="mt-12 text-[0.90rem] text-center font-semibold text-gray-800">
            <span>{`have an account?`}</span>
            <Link href="/login" className="text-black font-medium"> Login </Link>  
          </p> 
        </div>
      </div>
    </div>
  );
};

export default Page;