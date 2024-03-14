"use client"

import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import axios from 'axios'
import React from 'react'
import toast from 'react-hot-toast'

const ForgetPassword = () => {
  interface User {
    email : string
  }
  const [user , setUser] = React.useState<User>({ 
    email : ''
  })
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const changeHandler = (e : React.ChangeEvent<HTMLInputElement>) => {
    setUser({...user , [e.target.name] : e.target.value})
  }
  const sumbitHandler = async(e: React.FormEvent<HTMLFormElement>) => {
    try {
      setIsLoading(true)
      e.preventDefault()
      const email = user.email
      const response = await axios.post('/api/users/forgetpassword',{email})
      if(!response.data.success) {
        throw new Error(response.data.message)
      }
      toast.success(response.data.message)
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
            Forget password
            </h2>
          </div>
          <form onSubmit={sumbitHandler} className="mt-6">
            <div className="my-5 text-sm">
            <Input 
            placeholder='Email'
            type="email"
            id="email"
            name="email"
            value={user.email}
            onChange={changeHandler}
            required
            autoFocus
            >
            Email
            </Input>
            </div>

            <Button
              isLoading={isLoading}
              type='submit'
              className='max-w-sm mx-auto w-full'
              >
              Forget password
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ForgetPassword
