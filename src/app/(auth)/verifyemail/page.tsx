"use client"
import Button from "@/components/ui/Button"
import axios from "axios"
import { MailCheck, MailQuestion } from "lucide-react"
import { useRouter } from "next/navigation"
import React , {useEffect} from "react"
import toast from "react-hot-toast"

export default function VerifyEmailPage() {
  const [token , setToken] = React.useState<string>("")
  const [verified , setVerified] = React.useState<boolean>(false)
  const [url , setUrl] = React.useState<string>('')
  const router = useRouter()
  
  useEffect(() => {
    const urlToken = window.location.search.split("=")[1]
    setToken(urlToken || "")
    const url = window.location
    setUrl(url.href)
  },[])

  const verifyUserEmail = async () => {
    try {
      setIsLoading(true)
      const response = await axios.post('/api/users/verifyemail',{token})
      if(!response.data.success) {
        throw new Error(response.data.message)
      }
      toast.success(response.data.message)
      setVerified(true)
      router.push('/login')
    } catch (error :any) {
      toast.error(error.message)
    } finally {
      setIsLoading(false)
    }
  }
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  function clickHandler() {
    if(token.length > 0) {
      verifyUserEmail()
    }
  }

  return (
    <div className='flex h-screen items-center justify-center flex-col py-12 gap-8 px-4 sm:px-6 lg:px-8'>
      <div className='flex flex-col items-center justify-center'>
        <h2 className=' text-center text-3xl font-bold tracking-tight text-gray-900'>
        Verify Email
        </h2>
        {verified ? <MailCheck size={100} /> : <MailQuestion size={100} />}
        <p className=' text-center text-3xl font-bold tracking-tight text-gray-900'>
          {`We're happy you're here. Let's get your email address verified:`}
        </p>
      </div>
      <Button
        isLoading={isLoading}
        type='button'
        className='max-w-sm mx-auto w-full'
        onClick={clickHandler}
        >
        Verify Email
      </Button>

      <p className="mt-12 text-[0.90rem] text-center font-semibold text-gray-800">
          {`If you’re having trouble clicking the "Verify Email Address" button, copy and paste the URL below`}
          <br />
        <span>{url}</span>
      </p> 
    </div>
  )
}