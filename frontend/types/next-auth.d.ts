import NextAuth, { DefaultSession } from 'next-auth';
import { JWT } from 'next-auth/jwt';

declare module 'next-auth'{
  interface User{
    access_token: string;
  }

  interface Session{
    accessToken: string;
    user: {

    } & DefaultSession['user'];
  }
}

declare module 'next-auth/jwt'{
  interface JWT{
    accessToken: string
  }
}