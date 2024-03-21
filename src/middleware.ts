

import { getToken } from 'next-auth/jwt'
import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  async function middleware(req) {
    const pathname = req.nextUrl.pathname

    // Manage route protection
    const isAuth = await getToken({ req })
    const isLoginPage = pathname.startsWith('/login')

    const sensitiveRoutes = ['/dashboard']
    const isAccessingSensitiveRoute = sensitiveRoutes.some((route) =>
      pathname.startsWith(route)
    )

    if (isLoginPage) {
      if (isAuth) {
        return NextResponse.redirect(new URL('/dashboard', req.url))
      }

      return NextResponse.next()
    }

    if (!isAuth && isAccessingSensitiveRoute) {
      return NextResponse.redirect(new URL('/login', req.url))
    }

    if (pathname === '/') {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }
  },
  {
    callbacks: {
      async authorized() {
        return true
      },
    },
  }
)

export const config = {
  matchter: ['/', '/login', '/dashboard/:path*'],
}


// import { NextResponse } from "next/server";
// import { NextRequest } from "next/server";

// // THIS FUNCTION CAN BE MARKED 'ASYNC' IF USING AWAIT INSIDE

// export default function middleware(request : NextRequest) {
//   const pathname = request.nextUrl.pathname
//   const path = request.nextUrl.pathname
//   const isPublicPath = path === '/login' || path === '/signup' || path === '/verifyemail' || path === '/resetpassword'
//   const token = request.cookies.get('token')?.value || ''
//   if(isPublicPath && token) {
//     return NextResponse.redirect(new URL('/dashboard',  request.nextUrl))
//   }
//   if(!isPublicPath && !token) {
//     return NextResponse.redirect(new URL('/login' , request.nextUrl))
//   }
//   if(pathname === '/') {
//     return NextResponse.redirect(new URL('/dashboard' , request.nextUrl))
//   }
// }

// // SEE "MATCHING PATHS" BELOW TO LEARN MORE
// // ALLOWING TO RUN ON SPECIFIC PATH
// export const config = {
//   matcher : [
//     '/',
//     '/profile/:id*',
//     '/profile',
//     '/login',
//     '/signup',
//     '/verifyemail',
//     '/resetpassword',
//     '/dashboard/:path*'
//   ]
// }
