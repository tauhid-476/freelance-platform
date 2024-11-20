import { prismaClient } from "@/lib/db";
import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google";
const handler = NextAuth({
  // i want to use github
  // i want to use google
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? ""
    })
  ],
  secret: process.env.NEXTAUTH_SECRET ?? "secret",
  callbacks: {
    async signIn(params) {
      console.log(params);
      if(!params.user.email){
        return false
      }
      //making entry in db
      try {
        await prismaClient.user.create({
          data:{
            email: params.user.email,
            provider:"Google"

          }
        })
      } catch (error) {
        
      }
      return true
    }
  }
})


//since in route ts lal files are return as request types=>gwt post delete etc.
export { handler as GET, handler as POST }
