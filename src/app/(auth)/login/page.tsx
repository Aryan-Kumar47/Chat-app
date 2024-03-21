
"use client"

import { Icons } from '@/components/Icons';
import Button from '@/components/ui/Button';
import { signIn } from 'next-auth/react';
import React from 'react';
import toast from 'react-hot-toast';

const Page = () => {
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  async function loginWithGoogle() {
    try {
      setIsLoading(true)
      await signIn('google')
    } catch (error:any) {
        toast.error(error.message)
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <div className='flex h-screen items-center justify-center py-12 px-4 sm:px-6 lg:px-8'>
      <div className="lg:w-4/12 md:6/12 w-10/12 m-auto my-10">
        <div className="py-8 px-8 rounded-xl">
          <div className='flex flex-col justify-center items-center mb-10'>
            <Icons.MessagesSquare className='h-20 w-20 text-indigo-600'/>
            <h1 className=' text-center text-3xl font-bold tracking-tight text-indigo-600'>Welcome to Quicky Chat</h1>
          </div>
          <div className='flex flex-col items-center gap-3'>
            <h2 className=' text-center text-3xl font-bold tracking-tight text-gray-900'>
            Login
            </h2>
            <Button
            isLoading={isLoading}
            type='button'
            className='max-w-sm mx-auto w-full'
            onClick={loginWithGoogle}>
            {isLoading ? null : (
              <svg
                className='mr-2 h-4 w-4'
                aria-hidden='true'
                focusable='false'
                data-prefix='fab'
                data-icon='github'
                role='img'
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 24 24'>
                <path
                  d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'
                  fill='#4285F4'
                />
                <path
                  d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'
                  fill='#34A853'
                />
                <path
                  d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'
                  fill='#FBBC05'
                />
                <path
                  d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'
                  fill='#EA4335'
                />
                <path d='M1 1h22v22H1z' fill='none' />
              </svg>
              )}
              Google
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;

// "use client"

// import Button from '@/components/ui/Button';
// import Input from '@/components/ui/Input';
// import axios from 'axios';
// import Link from 'next/link';
// import { useRouter } from 'next/navigation';
// import React, { FC, useEffect } from 'react';
// import toast from 'react-hot-toast';

// const Page = () => {
//   const router = useRouter()
//   interface User {
//     email : string,
//     password : string
//   }
//   const [user , setUser] = React.useState<User>({
//     email : "",
//     password : "",
//   })

//   const changeHandler = (e : React.ChangeEvent<HTMLInputElement>) => {
//     setUser({...user , [e.target.name] : e.target.value})
//   }

//   const [isLoading, setIsLoading] = React.useState<boolean>(false)
//   async function sumbitHandler(e: React.FormEvent<HTMLFormElement>) {
//     try {
//       setIsLoading(true)
//       e.preventDefault()
//       const response = await axios.post('api/users/login', user)
//       if(!response.data.success){
//         throw new Error(response.data.message)
//       }
//       toast.success(response.data.message)
//       router.push('/dashboard')
//     } catch (error:any) {
//         toast.error(error.message)
//     } finally {
//       setIsLoading(false)
//     }
//   }
//   return (
//     <div className='flex h-screen items-center justify-center py-12 px-4 sm:px-6 lg:px-8'>
//       <div className="bg-white lg:w-4/12 md:6/12 w-10/12 m-auto my-10 shadow-md">
//         <div className="py-8 px-8 rounded-xl">
//           <div className='flex flex-col items-center'>
//             <h2 className=' text-center text-3xl font-bold tracking-tight text-gray-900'>
//             Login
//             </h2>
//           </div>
//           <form onSubmit={sumbitHandler} className="mt-6">
//             <div className="my-5 text-sm">
//             <Input 
//             placeholder='Email'
//             type="email"
//             id="email"
//             name="email"
//             value={user.email}
//             onChange={changeHandler}
//             required
//             autoFocus
//             >
//             Email
//             </Input>
//             </div>
//             <div className="my-5 text-sm">
//               <Input 
//               placeholder='Password'
//               type="password"
//               id="password"
//               name="password"
//               value={user.password}
//               onChange={changeHandler}
//               required
//               >
//               Password
//               </Input>
//               <div className="flex justify-end mt-2 text-xs text-gray-600">
//                 <Link href="/forgetpassword" target='_blank'>Forget Password?</Link>
//               </div>
//             </div>

//             <Button
//               isLoading={isLoading}
//               type='submit'
//               className='max-w-sm mx-auto w-full'
//               >
//               Login
//             </Button>
//           </form>
//           <p className="mt-12 text-[0.90rem] text-center font-semibold text-gray-800">
//             <span>{`Don't have an account?`}</span>
//             <Link href="/signup" className="text-black font-medium"> Create One </Link>  
//           </p> 

//         </div>
//       </div>
//     </div>
//   );
// };

// export default Page;