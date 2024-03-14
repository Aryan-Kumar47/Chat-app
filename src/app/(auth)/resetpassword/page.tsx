"use client"

import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import React from 'react'
import toast from 'react-hot-toast'

const RestPasswordPage = () => {
  interface User {
    password : string,
    confirmPassword : string
  }
  const router = useRouter()
  const [user , setUser] = React.useState<User>({ 
    password : "",
    confirmPassword : "",
  })
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const changeHandler = (e : React.ChangeEvent<HTMLInputElement>) => {
    setUser({...user , [e.target.name] : e.target.value})
  }
  const sumbitHandler = async(e: React.FormEvent<HTMLFormElement>) => {
    try {
      setIsLoading(true)
      e.preventDefault()
      if(user.confirmPassword !== user.password) {
        throw new Error("Confirm password doesn't match")
      }
      const urlToken = window.location.search.split("=")[1]
      const data = {
        token : urlToken,
        password : user.password
      }
      const response = await axios.post('api/users/resetpassword' , data)
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
    <div className='flex min-h-screen items-center justify-center py-12 px-4 sm:px-6 lg:px-8'>
      <div className="bg-white lg:w-4/12 md:6/12 w-10/12 m-auto my-10 shadow-md">
        <div className="py-8 px-8 rounded-xl">
          <div className='flex flex-col items-center'>
            <h2 className=' text-center text-3xl font-bold tracking-tight text-gray-900'>
            Reset password
            </h2>
          </div>
          <form onSubmit={sumbitHandler} className="mt-6">
            <div className="my-5 text-sm">
            <Input 
            placeholder='Email'
            type="password"
            id="password"
            name="password"
            value={user.password}
            onChange={changeHandler}
            required
            autoFocus
            >
            Password
            </Input>
            <Input 
            placeholder='Email'
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={user.confirmPassword}
            onChange={changeHandler}
            required
            >
            Confirm password
            </Input>
            </div>

            <Button
              isLoading={isLoading}
              type='submit'
              className='max-w-sm mx-auto w-full'
              >
              Reset password
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default RestPasswordPage