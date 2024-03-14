import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

// THIS FUNCTION CAN BE MARKED 'ASYNC' IF USING AWAIT INSIDE

export default function middleware(request : NextRequest) {
  const pathname = request.nextUrl.pathname
  const path = request.nextUrl.pathname
  const isPublicPath = path === '/login' || path === '/signup' || path === '/verifyemail' || path === '/resetpassword'
  const token = request.cookies.get('token')?.value || ''
  if(isPublicPath && token) {
    return NextResponse.redirect(new URL('/dashboard',  request.nextUrl))
  }
  if(!isPublicPath && !token) {
    return NextResponse.redirect(new URL('/login' , request.nextUrl))
  }
  if(pathname === '/') {
    return NextResponse.redirect(new URL('/dashboard' , request.nextUrl))
  }
}

// SEE "MATCHING PATHS" BELOW TO LEARN MORE
// ALLOWING TO RUN ON SPECIFIC PATH
export const config = {
  matcher : [
    '/',
    '/profile/:id*',
    '/profile',
    '/login',
    '/signup',
    '/verifyemail',
    '/resetpassword',
    '/dashboard/:path*'
  ]
}
