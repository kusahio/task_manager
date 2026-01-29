import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { login } from "@/services/auth";
import { log } from "console";

export const authOptions: NextAuthOptions = {

  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        try{
          const data = await login(credentials.email, credentials.password);

          if (data){
            return {
              id: '1',
              email: credentials.email,
              accessToken: data.access_token,
            };
          }
          return null;
        } catch (err){
          throw new Error(`Credenciales inválidas`)
        }

        // const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL+'/users/login', {
        //   method: "POST",
        //   body: JSON.stringify({
        //     email: credentials?.email,
        //     password: credentials?.password,
        //   }),
        //   headers: { "Content-Type": "application/json" },
        // });

        // const user = await res.json();

        // if (!res.ok) throw new Error(user.detail || "Credenciales inválidas");
        // return user;
      }
    })
  ],
  // session: {
  //   strategy: "jwt",
  //   maxAge: 7 * 24 * 60 * 60,
  // },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken
      }
      return token;
    },
    async session({ session, token }) {
      session.user.accessToken = token.accessToken
      return session;
    }
  },
  pages: {
    signIn: '/login',
  }
};

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST}