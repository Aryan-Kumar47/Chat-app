'use client'
import React, { ButtonHTMLAttributes, FC } from 'react';
import Button from './ui/Button';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { Loader2, LogOut } from 'lucide-react';


interface SignOutButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  
}

const SignOutButton: FC<SignOutButtonProps> = ({ ...props}) => {
  const router = useRouter()
  const [isSigningOut , setIsSigningOut] = React.useState<boolean>(false)
  const logout = async() => {
    try {
      setIsSigningOut(true)
      console.log('called')
      await axios.get(`/api/users/logout`)
      console.log('done')
      toast.success("Logout successfuls")
      router.push('/login')
    } catch (error : any) {
      toast.error(error.message)
    } finally {
      setIsSigningOut(false)
    }
  }
  return (
    <Button {...props} variant={'ghost'} onClick={logout}>
      {isSigningOut ? (
        <Loader2 className='animate-spin h-4 w-4' />
      ) : (
        <LogOut className='w-4 h-4' />
      )}
    </Button>
  );
};

export default SignOutButton;