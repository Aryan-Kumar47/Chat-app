import clientPromise from "./mongodb";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import { NextAuthOptions, User } from "next-auth"
import GoogleProvider from "next-auth/providers/google";
import { connect } from "@/dbConfig/dbConfig";
import { Adapter } from "next-auth/adapters";
import Users from "@/models/userModel";
connect()
function getGoogleCredentials () {
  const clientId = process.env.GOOGLE_CLIENT_ID!
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET!
  if(!clientId || clientId.length === 0) {
    throw new Error('Missing GOOGLE_CLIENT_ID')
  }
  if(!clientSecret || clientSecret.length === 0) {
    throw new Error('Missing GOOGLE_CLIENT_SECRET')
  }
  return {clientId , clientSecret}
}

export const authOptions : NextAuthOptions = {
  adapter : MongoDBAdapter(clientPromise) as Adapter,
  session : {
    strategy : 'jwt'
  },
  pages : {
    signIn : '/login'
  },
  providers : [
    GoogleProvider({
      clientId : getGoogleCredentials().clientId,
      clientSecret : getGoogleCredentials().clientSecret
    })
  ],
  callbacks : {
    async jwt ({token , user}) {  
      const dbUser = await Users.findById(token.id)
      if(!dbUser){
        if(user) {
          token.id = user.id
        }
        return token
      }
      const id = dbUser._id.toString()
      token.id = id
      token.name = dbUser.name
      token.email = dbUser.email
      token.picture = dbUser.image
      return token
    },
    async session({ session , token}) {
      if(token) {
        session.user.id = token.id
        session.user.email = token.email
        session.user.name = token.name
        session.user.image = token.picture
      }
      return session
    },
    redirect() {
      return '/dashboard'
    },
  },
}